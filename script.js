import { getSynonyms, getDefinition, formatError } from './llm.js';

document.addEventListener("DOMContentLoaded", function () {
    const wordInput = document.getElementById("word-input");
    const generateBtn = document.getElementById("generate-btn");
    const synonymList = document.getElementById("synonym-list");
    const loadingSpinner = document.getElementById("loading-spinner");
    const resultsTitle = document.getElementById("results-title");
    const messageBoxEl = document.getElementById("message-box");

    const aboutThessaModal = document.getElementById("about-thessa-modal");
    const thessaInfoBtn = document.getElementById("thessa-info-btn");
    const aboutModalCloseBtn = document.getElementById("about-modal-close-btn");

    const definitionPopover = document.getElementById("definition-popover");
    const popoverWordTitle = document.getElementById("popover-word");
    const popoverDefinitionLoader = document.getElementById(
        "popover-definition-loader"
    );
    const popoverDefinitionText = document.getElementById("popover-definition");
    const popoverErrorText = document.getElementById("popover-error");

    const copyNotificationEl = document.getElementById("copy-notification");
    let copyNotificationTimeout;

    const NUM_OF_SYNONYMS = 8;
    let currentOpenPopoverTarget = null;
    let currentSynonymIsBulgarian = false;

    document.getElementById("word-input").value = "";
    document.body.classList.remove("has-results"); // Ensure clean state on load
    wordInput.focus(); // Focus main input on load

    generateBtn.addEventListener("click", fetchSynonyms);
    wordInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") fetchSynonyms();
    });

    thessaInfoBtn.addEventListener("click", () => showModal(aboutThessaModal));
    aboutModalCloseBtn.addEventListener("click", () => hideModal(aboutThessaModal));
    aboutThessaModal.addEventListener("click", (event) => {
        if (event.target === aboutThessaModal) hideModal(aboutThessaModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (aboutThessaModal.style.display === "flex") {
                hideModal(aboutThessaModal);
            } else if (definitionPopover.classList.contains("visible")) {
                hideDefinitionPopover();
            }
        }
    });

    document.addEventListener("click", function (event) {
        if (definitionPopover.classList.contains("visible")) {
            const isClickInsidePopover = definitionPopover.contains(event.target);
            const isClickOnPopoverTarget =
                currentOpenPopoverTarget &&
                currentOpenPopoverTarget.contains(event.target);
            if (!isClickInsidePopover && !isClickOnPopoverTarget) {
                hideDefinitionPopover();
            }
        }
    });



    async function fetchSynonyms() {
        const word = wordInput.value.trim();

        document.body.classList.remove("has-results");

        if (!word) {
            displayMessage("Please enter a word.", "error");
            return;
        }

        clearResultsAndMessages();
        hideDefinitionPopover();
        loadingSpinner.style.display = "block";
        generateBtn.disabled = true;
        generateBtn.innerHTML = `\n            <svg class="btn-icon loading-btn-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;

        try {
            const textResponse = await getSynonyms(word, NUM_OF_SYNONYMS);
            displaySynonyms(textResponse, word);
        } catch (error) {
            console.error("Error fetching synonyms:", error);
            displayMessage(formatError(error), "error");
        } finally {
            loadingSpinner.style.display = "none";
            generateBtn.disabled = false;
            generateBtn.innerHTML = `\n                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
        }
    }

    function displaySynonyms(responseText, originalWord) {
        resultsTitle.style.display = "block";
        resultsTitle.textContent = `Synonyms for "${originalWord}"`;

        const lines = responseText
            .split("\n")
            .map((line) => line.trim())
            .filter(
                (line) => line && !/^(here is|sure,)/i.test(line.toLowerCase())
            );

        if (
            lines.length === 0 ||
            /no synonyms found/i.test(responseText.toLowerCase())
        ) {
            displayMessage(`No synonyms found for "${originalWord}".`, "info");
            resultsTitle.style.display = "none";
            document.body.classList.remove("has-results");
        } else {
            const limitedLines = lines.slice(0, NUM_OF_SYNONYMS);
            limitedLines.forEach((item, index) => {
                const li = document.createElement("li");
                const cleanSynonym = item.replace(/^[\*\-]\s*|\s*\(.*\)\s*$/, "");
                li.textContent = cleanSynonym;
                li.classList.add("synonym-item");

                const isBulgarianSynonym = /[а-яА-Я]+/g.test(cleanSynonym);

                li.addEventListener("click", (e) =>
                    handleSynonymClick(
                        cleanSynonym,
                        e.currentTarget,
                        isBulgarianSynonym
                    )
                );
                synonymList.appendChild(li);
            });
            document.body.classList.add("has-results");
        }
    }

    function displayMessage(message, type = "error") {
        messageBoxEl.textContent = message;
        messageBoxEl.className = `message-box ${
            type === "error" ? "error-message" : "info-message-box"
        }`;
        messageBoxEl.style.display = "block";
        if (type === "error") {
            resultsTitle.style.display = "none";
            document.body.classList.remove("has-results");
        }
    }

    function clearResultsAndMessages() {
        synonymList.innerHTML = "";
        resultsTitle.style.display = "none";
        messageBoxEl.style.display = "none";
        document.body.classList.remove("has-results");
    }

    function handleSynonymClick(synonym, targetElement, isBulgarian = false) {
        if (
            targetElement === currentOpenPopoverTarget &&
            definitionPopover.classList.contains("visible")
        ) {
            const textToCopy = synonym.toLowerCase();
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                    showCopyNotification(`Copied "${textToCopy}"!`);
                })
                .catch((err) => {
                    console.error("Failed to copy text: ", err);
                    showCopyNotification("Failed to copy!", true);
                });
            return;
        }

        currentOpenPopoverTarget = targetElement;
        currentSynonymIsBulgarian = isBulgarian;
        positionAndShowDefinitionPopover(synonym, targetElement);
        fetchDefinitionForPopover(synonym);
    }

    async function fetchDefinitionForPopover(word) {
        popoverDefinitionText.textContent = "";
        popoverErrorText.style.display = "none";
        popoverDefinitionLoader.style.display = "block";

        try {
            const definition = await getDefinition(word);
            updatePopoverWithDefinition(definition.trim());
        } catch (error) {
            console.error("Error fetching definition:", error);
            updatePopoverWithError(formatError(error));
        }
    }

    function positionAndShowDefinitionPopover(word, targetElement) {
        definitionPopover.classList.remove("visible", "popover-left");

        let popoverWordContent = word;
        if (currentSynonymIsBulgarian) {
            popoverWordContent += " 🇧🇬";
        }
        popoverWordTitle.textContent = popoverWordContent;

        popoverDefinitionText.textContent = "";
        popoverErrorText.style.display = "none";
        popoverDefinitionLoader.style.display = "block"; // Show loader initially

        definitionPopover.style.display = "block";

        const rect = targetElement.getBoundingClientRect();
        const popoverHeight = definitionPopover.offsetHeight;
        let popoverWidth = definitionPopover.offsetWidth;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        let top = rect.top + scrollY + rect.height / 2 - popoverHeight;
        let left = rect.right + scrollX + 14;
        let useLeft = false;

        if (left + popoverWidth > viewportWidth - 10) {
            left = rect.left + scrollX - popoverWidth - 14;
            useLeft = true;
        }
        if (left < 10) {
            left = 10;
            if (useLeft && rect.left + scrollX - popoverWidth - 14 < 10) {
                if (rect.right + scrollX + 14 + popoverWidth < viewportWidth - 10) {
                    left = rect.right + scrollX + 14;
                    useLeft = false;
                }
            }
        }
        if (!useLeft && left + popoverWidth > viewportWidth - 10) {
            left = viewportWidth - popoverWidth - 10;
            if (left < 10) left = 10;
        }

        if (top < scrollY + 10) {
            top = scrollY + 10;
        } else if (top + popoverHeight > scrollY + viewportHeight - 10) {
            top = scrollY + viewportHeight - popoverHeight - 10;
        }
        if (top < scrollY + 10) top = scrollY + 10;

        definitionPopover.style.top = `${top}px`;
        definitionPopover.style.left = `${left}px`;

        definitionPopover.classList.remove("popover-left");
        if (useLeft) {
            definitionPopover.classList.add("popover-left");
        }
        definitionPopover.classList.add("visible");
    }

    function updatePopoverWithDefinition(definition) {
        popoverDefinitionLoader.style.display = "none";
        popoverDefinitionText.textContent = definition;
    }

    function updatePopoverWithError(message) {
        popoverDefinitionLoader.style.display = "none";
        popoverDefinitionText.textContent = "";
        popoverErrorText.textContent = message;
        popoverErrorText.style.display = "block";
    }

    function hideDefinitionPopover() {
        definitionPopover.classList.remove("visible");
        currentOpenPopoverTarget = null;
        currentSynonymIsBulgarian = false;
        setTimeout(() => {
            if (!definitionPopover.classList.contains("visible")) {
                definitionPopover.style.display = "none";
                popoverDefinitionLoader.style.display = "none";
                popoverErrorText.style.display = "none";
            }
        }, 250);
    }

    function showModal(modalElement) {
        modalElement.style.display = "flex";
        document.body.style.overflow = "hidden"; // Prevent background scroll when modal is open
        // Ensure correct animations are set if they were cleared
        modalElement.style.animationName = "fadeInModalBg";
        if (modalElement.querySelector(".modal-content")) {
            modalElement.querySelector(".modal-content").style.animationName =
                "slideInModalContent";
        }
    }

    function hideModal(modalElement) {
        modalElement.style.animationName = "fadeOutModalBg";
        if (modalElement.querySelector(".modal-content")) {
            modalElement.querySelector(".modal-content").style.animationName =
                "slideOutModalContent";
        }

        setTimeout(() => {
            modalElement.style.display = "none";
            document.body.style.overflow = "auto"; // Restore scroll
            // Reset animation names so they can play again next time
            modalElement.style.animationName = "";
            if (modalElement.querySelector(".modal-content")) {
                modalElement.querySelector(".modal-content").style.animationName =
                    "";
            }
        }, 300); // Match animation duration
    }

    function showCopyNotification(
        message = "Copied to clipboard!",
        isError = false
    ) {
        copyNotificationEl.textContent = message;
        copyNotificationEl.style.backgroundColor = isError
            ? "var(--error-color)"
            : "var(--teal-mid)";
        copyNotificationEl.style.color = isError
            ? "var(--text-color)"
            : "var(--bg-color)";

        copyNotificationEl.classList.add("show");

        clearTimeout(copyNotificationTimeout);
        copyNotificationTimeout = setTimeout(() => {
            copyNotificationEl.classList.remove("show");

            setTimeout(() => {
                if (!copyNotificationEl.classList.contains("show")) {
                    copyNotificationEl.style.display = "none";
                    copyNotificationEl.style.backgroundColor = "";
                    copyNotificationEl.style.color = "";
                }
            }, 300);
        }, 2000);
    }
});
