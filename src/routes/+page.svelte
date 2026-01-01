<script>
    import QueryBar from "$lib/components/query-bar.svelte";
    import Spinner from "$lib/components/spinner.svelte";
    import SynonymList from "$lib/components/synonym-list.svelte";

    import { getSynonyms } from "$lib/assets/llm.js";

    let showQueryBar = $state(true);
    let userQuery = $state("");

    function querySubmit(query) {
        showQueryBar = false;
        userQuery = query;
    }

    function handleKeydown(event) {
        if (event.key === "Backspace") {
            showQueryBar = true;
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<ethmarks-header active="projects"></ethmarks-header>

<main>
    <div id="heading-container">
        <button onclick={() => (showQueryBar = true)}>
            <h1 class="nomint">Thessa</h1>
        </button>
    </div>
    <div id="content-container">
        {#if showQueryBar}
            <QueryBar onSubmit={querySubmit}></QueryBar>
        {:else}
            {#await getSynonyms(userQuery)}
                <Spinner></Spinner>
            {:then response}
                <SynonymList query={userQuery} textRaw={response}></SynonymList>
            {:catch error}
                <div class="error-message">
                    <h2>Error</h2>
                    <p>
                        {error.message ||
                            "Failed to load synonyms. Please try again."}
                    </p>
                    <button onclick={() => (showQueryBar = true)}
                        >Try Again</button
                    >
                </div>
            {/await}
        {/if}
    </div>
</main>

<ethmarks-footer source="https://github.com/ethmarks/thessa"></ethmarks-footer>

<style>
    main {
        --main-margin-top: 5rem;
        min-height: calc(100vh - var(--main-margin-top) - 10rem - 45px);
        justify-content: center;
        padding: 0;
        margin-bottom: var(--spacing-lg);

        @media (max-width: 768px) {
            --main-margin-sides: var(--spacing-md);
        }
    }

    #heading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin: var(--spacing-md) 0;

        button {
            cursor: pointer;
            background: none;
            border: none;
            padding: 0;
            font-family: inherit;
        }

        h1 {
            color: var(--color-accent-light);
            font-weight: 700;
            font-size: 3.2rem;
            letter-spacing: 0.2px;
        }
    }

    #content-container {
        display: flex;
        width: 100%;
    }

    .error-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        gap: var(--spacing-md);
        padding: var(--spacing-xl);
        text-align: center;
        color: var(--color-text);

        h2 {
            color: #ff6464;
            font-size: 1.5rem;
            margin: 0;
        }

        p {
            font-size: 1rem;
            opacity: 0.9;
            margin: 0;
        }

        button {
            background: var(--color-accent-light);
            color: var(--color-background);
            border: none;
            padding: var(--spacing-sm) var(--spacing-lg);
            border-radius: var(--radius-md);
            font-size: 1rem;
            cursor: pointer;
            transition: opacity 0.2s;

            &:hover {
                opacity: 0.8;
            }
        }
    }
</style>
