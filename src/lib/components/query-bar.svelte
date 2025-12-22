<input type="text" placeholder="Enter a word or phrase (e.g. 'brilliant')" />

<style>
    input {
        margin: 0 auto 10rem;
        padding: 1rem 1.5rem;
        width: 100%;
        max-width: 800px;

        border-radius: 999px;
        border: var(--border-accent-t);
        outline: none;
        background: rgba(255, 255, 255, 0.03);

        text-align: center;
        color: var(--color-text);
        font-size: var(--font-size-h4);
        font-family: var(--font-secondary);
        caret-color: var(--color-accent);

        transition-property: border, background, box-shadow;
        transition-duration: var(--transition-duration);
        transition-timing-function: var(--transition-timing);

        &:focus {
            border: var(--border-accent);
            background: rgba(255, 255, 255, 0.05);
            box-shadow:
                0 0 0 4px var(--color-accent-transparent-20),
                0 2px 8px rgba(0, 0, 0, 0.1) inset;
        }
    }
</style>
