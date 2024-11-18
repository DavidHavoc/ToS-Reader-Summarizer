# ToS Checker Chrome Extension

## Description

This Chrome extension checks if the Terms of Service (ToS) are present on a webpage and rates them using the Hugging Face Inference API. The extension sends the ToS text to a specified model and receives a score between 0 and 100, where 100 indicates that the ToS is very user-friendly and 0 indicates that it is very sketchy.

## Features

- Detects Terms of Service on the current webpage.
- Sends the ToS text to the Hugging Face Inference API.
- Receives a score from the API and displays it to the user.

## Prerequisites

- A Hugging Face API key. You can obtain one by signing up at [Hugging Face](https://huggingface.co/).

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/DavidHavoc/tos-checker-extension.git
   cd tos-checker-extension