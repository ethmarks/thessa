<script>
    import { getDefinition } from "$lib/assets/llm.js";

    let { word, x, y, onClose } = $props();

    let definition = $state("");
    let loading = $state(true);
    let error = $state(false);
    let popupElement = $state(null);
    let adjustedX = $state(0);
    let adjustedY = $state(0);

    async function fetchDefinition() {
        try {
            loading = true;
            error = false;
            definition = await getDefinition(word);
        } catch (err) {
            console.error("Error fetching definition:", err);
            error = true;
            definition = "Unable to load definition.";
        } finally {
            loading = false;
        }
    }

    function handleClickOutside(event) {
        if (event.target.closest(".definition-popup") === null) {
            onClose();
        }
    }

    function adjustPosition() {
        if (!popupElement) return;

        const rect = popupElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newX = x;
        let newY = y;

        // Adjust horizontal position if popup goes off right edge
        if (rect.right > viewportWidth) {
            newX = viewportWidth - rect.width - 16;
        }

        // Adjust horizontal position if popup goes off left edge
        if (rect.left < 0) {
            newX = 16;
        }

        // Adjust vertical position if popup goes off bottom edge
        if (rect.bottom > viewportHeight) {
            newY = y - rect.height - 16; // Position above the element instead
        }

        // Adjust vertical position if popup goes off top edge
        if (newY < 0) {
            newY = 16;
        }

        adjustedX = newX;
        adjustedY = newY;
    }

    $effect(() => {
        // Initialize positions from props
        adjustedX = x;
        adjustedY = y;

        fetchDefinition();
        document.addEventListener("click", handleClickOutside);

        // Adjust position after render
        if (popupElement) {
            adjustPosition();
            popupElement.focus();
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });
</script>

<div
    bind:this={popupElement}
    class="definition-popup"
    style="left: {adjustedX}px; top: {adjustedY}px;"
    role="dialog"
    aria-labelledby="popup-title"
    tabindex="-1"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.key === "Escape" && onClose()}
>
    <div class="popup-header">
        <h3 id="popup-title">{word}</h3>
    </div>
    <div class="popup-content">
        {#if loading}
            <div class="loading">Loading...</div>
        {:else if error}
            <div class="error">{definition}</div>
        {:else}
            <p>{definition}</p>
        {/if}
    </div>
</div>

<style>
    .definition-popup {
        position: fixed;
        background: var(--color-article);
        border: var(--border-accent-t);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        z-index: 1000;
        min-width: 300px;
        max-width: 400px;
        animation: popup-appear 0.2s ease-out;
        backdrop-filter: blur(10px);
    }

    .popup-header {
        margin-bottom: var(--spacing-sm);
        border-bottom: var(--border-accent-t);
        padding-bottom: var(--spacing-xs);
    }

    .popup-header h3 {
        color: var(--color-accent-light);
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0;
    }

    .popup-content {
        color: var(--color-text);
        line-height: 1.6;
        font-size: 0.95rem;
    }

    .popup-content p {
        margin: 0;
    }

    .loading,
    .error {
        font-style: italic;
        opacity: 0.7;
    }

    .error {
        color: #ff6464;
    }

    @keyframes popup-appear {
        0% {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
</style>
