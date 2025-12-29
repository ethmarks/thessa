<script>
    import Synonym from "./synonym.svelte";

    let { textRaw } = $props();

    let synonyms = $derived(
        textRaw
            .toLowerCase()
            .replace(/[!.,;?]+$/, "")
            .split(", "),
    );
</script>

<ul>
    {#each synonyms as synonymText}
        <Synonym text={synonymText}></Synonym>
    {/each}
</ul>

<style>
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
