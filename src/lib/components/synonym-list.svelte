<script>
    import Synonym from "./synonym.svelte";

    let { query, textRaw } = $props();

    let synonyms = $derived(
        textRaw
            .toLowerCase()
            .replace(/[!.,;?]+$/, "")
            .split(", "),
    );
</script>

<div id="container">
    <h2>Synonyms for "{query}"</h2>
    <ul>
        {#each synonyms as synonymText}
            <Synonym text={synonymText}></Synonym>
        {/each}
    </ul>
</div>

<style>
    #container {
        display: flex;
        flex-direction: column;
    }

    h2 {
        color: var(--color-accent-dark);
        margin-bottom: var(--spacing-lg);
        font-weight: 600;
        text-align: center;
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
        width: 100%;
        list-style: none;
        padding: 0;
        margin: 0 auto 10rem;
    }
</style>
