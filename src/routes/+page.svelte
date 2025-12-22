<script>
    import QueryBar from "$lib/components/query-bar.svelte";
</script>

<ethmarks-header active="projects"></ethmarks-header>

<main>
    <div id="heading-container">
        <h1 class="nomint">Thessa</h1>
    </div>
    <div id="content-container">
        <QueryBar></QueryBar>
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
        margin: var(--spacing-xl) 0;

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
