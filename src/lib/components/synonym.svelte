<script>
    let { text, index } = $props();
</script>

<li>
    <button style="--animation-delay: {index * 0.01}s">{text}</button>
</li>

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
