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
</script>

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
</style>
