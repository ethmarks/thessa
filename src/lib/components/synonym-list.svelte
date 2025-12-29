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
