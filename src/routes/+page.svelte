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
        <h1 class="nomint">Thessa</h1>
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
        min-height: calc(100vh - var(--main-margin-top) - 45px);
        justify-content: center;
        padding: 0;
    }

    #heading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin: var(--spacing-md) 0;

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
