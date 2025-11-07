# Thessa

[https://ethmarks.github.io/thessa](https://ethmarks.github.io/thessa)

An AI-powered thesaurus that intelligently generates synonyms. Enter any word and discover common alternatives, rare archaisms, and multilingual cognates.

## What is Thessa?

Thessa (derived from "thesaurus") is a vocabulary expansion tool that leverages AI to provide curated synonym enumerations. Unlike traditional thesauruses, Thessa intelligently balances common and esoteric alternatives, making it perfect for anyone seeking to enhance their lexical repertoire.

## Features

- 🤖 **AI-Powered**: Uses [ch.at](https://ch.at/) for free, no-auth AI
- 🌍 **Multilingual Touch**: Always includes a Bulgarian cognate as the 8th synonym
- 📚 **Diverse Vocabulary**: Provides both common and rare, archaic alternatives
- 🆓 **Free to Use**: No API key required - works out of the box
- 🎨 **Clean Interface**: Minimalist design with smooth interactions
- 📖 **Instant Definitions**: Click any synonym to get AI-generated definitions
- 📋 **Quick Copy**: Double-click synonyms to copy them to clipboard
- 📱 **Responsive**: Works seamlessly across all devices

## Usage

1. Visit **[https://ethmarks.github.io/thessa](https://ethmarks.github.io/thessa)**.
2. Type any word into the input box and press the generate button.
3. Thessa will provide an AI-generated definition for a synonym if you click on it. This can be helpful for understanding the nuances in meaning of each synonym.
4. If you double-click a synonym, Thessa will copy it to your clipboard.

## How It Works

### Prompt

Thessa sends carefully crafted prompts to ch.at to generate exactly 8 synonyms:

> Provide a list of diverse English synonyms for "${word}", limited to a maximum of 8. Include some common synonyms as well as rare, esoteric ones. The 8th and final synonym should be in Bulgarian. "${word}" cannot be in your list of synonyms. No repeats. Capitalize the first letter of each synonym. Newline separated. Each line should ONLY include the synonym. NEVER anything other than the synonym on the line. NEVER include parenthesis. Your response should only include the list without any introductory or concluding text. If none, say "No synonyms found for ${word}."
