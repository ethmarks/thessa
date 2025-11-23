# Thessa

[https://ethmarks.github.io/thessa](https://ethmarks.github.io/thessa)

An AI-powered thesaurus that intelligently generates synonyms.

## What is Thessa?

Thessa (derived from "thesaurus") is an intelligent vocabulary tool that leverages AI to provide relevant synonyms for almost any input. Whether you're trying to mix up your diction, learn new words, or just trying to find that word on the tip of your tongue, Thessa can help.

## Features

- 🤖 **AI-Powered**: Uses an LLM to generate synonyms
- 🧠 **Intelligent Input**: Handles single words, phrases, gibberish, and edge cases
- 🌍 **Diverse Vocabulary**: Provides both common and rare, archaic alternatives
- 🆓 **Free to Use**: No API key required - works out of the box with multiple no-auth LLM providers
- 🎨 **Clean Interface**: Minimalist design with smooth interactions
- 📖 **Instant Definitions**: Click any synonym to get AI-generated definitions
- 📋 **Quick Copy**: Double-click synonyms to copy them to clipboard
- 📱 **Responsive**: Works seamlessly across all devices

## Usage

1. Visit **[https://ethmarks.github.io/thessa](https://ethmarks.github.io/thessa)**.
2. Type any word into the input box and press the generate button.
3. Thessa will provide an AI-generated definition for a synonym if you click on it. This can be helpful for understanding the nuances in meaning of each synonym.
4. If you double-click a synonym, Thessa will copy it to your clipboard.

## LLM Providers

Thessa uses a multi-provider architecture to ensure reliable LLM responses. It maintains a list of OpenAI-compatible API providers that don't require authentication. This list is ranked ranked by reliability. If one provider fails or is unavailable, Thessa automatically tries the next provider in the list. This approach ensures maximum uptime even when individual free API services experience intermittent issues (which they often do).

Thessa's provider list currently consists of:

1. **LLM7.io**: <https://api.llm7.io/v1/chat/completions>
2. **ch.at**: <https://ch.at/v1/chat/completions>
