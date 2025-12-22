<ethmarks-header active="projects"></ethmarks-header>

<main>
    <div id="heading">
        <h1 class="nomint">Thessa</h1>
    </div>
</main>

<ethmarks-footer source="https://github.com/ethmarks/thessa"></ethmarks-footer>

<style>
    main {
        margin-inline: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - var(--main-margin-top) - 45px);
        overflow-x: hidden;
        width: 100%;
        padding: 0;
    }

    #heading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 10px;

        h1 {
            color: var(--color-accent-light);
            font-weight: 700;
            font-size: 3.2rem;
            letter-spacing: 0.2px;
        }
    }
</style>
