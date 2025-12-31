<script>
    import favicon from "$lib/assets/favicon.ico";
    import { dev } from "$app/environment";
    import { injectAnalytics } from "@vercel/analytics/sveltekit";

    injectAnalytics({ mode: dev ? "development" : "production" });

    let { children } = $props();
</script>

<svelte:head>
    <title>Thessa</title>
    <link rel="icon" href={favicon} />
    <meta name="title" content="Thessa" />
    <meta
        name="description"
        content="An AI-powered thesaurus that intelligently generates synonyms."
    />
    <meta name="author" content="Ethan" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Thessa" />
    <meta
        property="og:description"
        content="An AI-powered thesaurus that intelligently generates synonyms."
    />
    <meta property="og:site_name" content="Thessa" />
    <meta property="twitter:card" content="summary" />
    <meta property="twitter:title" content="Thessa" />
    <meta
        property="twitter:description"
        content="An AI-powered thesaurus that intelligently generates synonyms."
    />
    <link rel="canonical" href="https://thessa.vercel.app/" />

    <link
        rel="stylesheet"
        href="https://ethmarks.vercel.app/css/global.min.css"
    />
    <script
        src="https://ethmarks.vercel.app/js/ethmarks-components.js"
        defer
    ></script>
</svelte:head>

{@render children()}
