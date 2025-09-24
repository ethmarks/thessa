# Thessa

[https://ethmarks.github.io/thessa](https://ethmarks.github.io/thessa)

An AI-powered thesaurus that generates synonyms using Google's Gemini API. Enter any word and discover common alternatives, rare archaisms, and multilingual cognates.

## What is Thessa?

Thessa (derived from "thesaurus") is a vocabulary expansion tool that leverages AI to provide curated synonym enumerations. Unlike traditional thesauruses, Thessa intelligently balances common and esoteric alternatives, making it perfect for anyone seeking to enhance their lexical repertoire.

## Features

- 🤖 **AI-Powered**: Uses Google's Gemini API for intelligent synonym generation
- 🌍 **Multilingual Touch**: Always includes a Bulgarian cognate as the 8th synonym
- 📚 **Diverse Vocabulary**: Provides both common and rare, archaic alternatives
- 💾 **Secure Storage**: API keys stored locally in browser storage
- 🎨 **Clean Interface**: Minimalist design with smooth interactions
- 📖 **Instant Definitions**: Click any synonym to get AI-generated definitions
- 📋 **Quick Copy**: Double-click synonyms to copy them to clipboard
- 📱 **Responsive**: Works seamlessly across all devices

## Usage

1. Visit **[https://ethmarks.github.io/thessa](https://ethmarks.github.io/thessa)**.
2. Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create a free Gemini API key.
3. Click the settings icon (⚙️) and enter your API key. It is stored securely in your browser and is never sent anywhere except to the official Gemini API endpoints.
4. Type any word into the input box and press the generate button.
5. Thessa will provide an AI-generated definition for a synonym if you click on it. This can be helpful for understand the nuances in meaning of each synonym.
6. If you double-click a synonym, Thessa will copy it to your clipboard.

## How It Works

### Prompt

Thessa sends carefully crafted prompts to the Gemini API to generate exactly 8 synonyms:

> Provide a list of diverse English synonyms for "${word}", limited to a maximum of 8. Include some common synonyms as well as rare, esoteric ones. The 8th and final synonym should be in Bulgarian. "${word}" cannot be in your list of synonyms. No repeats. Capitalize the first letter of each synonym. Newline separated. Each line should ONLY include the synonym. NEVER anything other than the synonym on the line. NEVER include parenthesis. Your response should only include the list without any introductory or concluding text. If none, say "No synonyms found for ${word}."

## API Key

Thessa *requires* an API key to function. You can generate one for free from [Google AI Studio](https://aistudio.google.com/app/apikey).

Your Gemini API key is stored securely in your browser's Local Storage and never transmitted anywhere except to Google's official API endpoints. This ensures your key remains private while enabling seamless functionality.

Google provides 30 free API requests per minute per key. You shouldn't run into this rate limit during casual or even heavy use, but note that the rate limit does exist.
