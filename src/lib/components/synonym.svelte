<script>
    import DefinitionPopup from "./definition-popup.svelte";
    import CopiedTooltip from "./copied-tooltip.svelte";

    let { text, index, isOpen, onOpen, onClose } = $props();

    let popupX = $state(0);
    let popupY = $state(0);
    let showCopied = $state(false);
    let copiedTimeout = null;

    function handleClick(event) {
        event.stopPropagation();

        if (isOpen) {
            // If popup is already open, copy to clipboard
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    console.log("Copied to clipboard:", text);
                    showCopied = true;
                    onClose();

                    // Clear any existing timeout
                    if (copiedTimeout) {
                        clearTimeout(copiedTimeout);
                    }

                    // Hide the "Copied!" message after 1.5 seconds
                    copiedTimeout = setTimeout(() => {
                        showCopied = false;
                        copiedTimeout = null;
                    }, 1500);
                })
                .catch((err) => {
                    console.error("Failed to copy:", err);
                });
        } else {
            // Open the popup
            const rect = event.target.getBoundingClientRect();
            popupX = rect.left;
            popupY = rect.bottom + 8; // 8px below the button
            onOpen();
        }
    }
</script>

<li>
    <button
        style="--animation-delay: {index * 0.01}s"
        onclick={handleClick}
        class:copied={showCopied}
    >
        {text}
        {#if showCopied}
            <CopiedTooltip></CopiedTooltip>
        {/if}
    </button>
</li>

{#if isOpen}
    <DefinitionPopup word={text} x={popupX} y={popupY} {onClose} />
{/if}

<style>
    li {
        display: contents;
    }

    button {
        padding: var(--spacing-xs) var(--spacing-sm);
        background-color: rgba(255, 255, 255, 0.03);
        border: var(--border-accent-t);
        color: var(--color-accent-light);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
        font-family: inherit;
        font-size: inherit;
        position: relative;

        animation: fade-in-from-top-left 0.2s ease-out forwards;
        animation-delay: var(--animation-delay);
        opacity: 0;

        &:hover {
            background-color: rgba(255, 255, 255, 0.05);
            border-color: var(--border-accent);
            transform: translateY(-2px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        &:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        &.copied {
            background-color: var(--color-accent-transparent-20);
            border-color: var(--color-accent);
        }
    }

    @keyframes fade-in-from-top-left {
        0% {
            opacity: 0;
            transform: translate(-20px, -20px);
        }
        100% {
            opacity: 1;
            transform: translate(0, 0);
        }
    }
</style>
