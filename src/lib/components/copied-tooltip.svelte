<span>Copied!</span>

<style>
    span {
        position: absolute;
        top: -35px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--color-accent);
        color: var(--color-text-inverse);
        padding: 4px 12px;
        border-radius: var(--radius-sm);
        font-size: 0.85rem;
        white-space: nowrap;
        pointer-events: none;
        animation: tooltip-appear 0.2s ease-out;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

        &::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: var(--color-accent);
        }
    }

    @keyframes tooltip-appear {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
        }
        100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
</style>
