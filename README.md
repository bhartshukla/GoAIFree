# GoAIFree

# 🚀 GoAIFree - AI to Human Text Converter

A complete solution to convert AI-generated text into 100% human-written content with advanced detection and API integration.

## Features

### 🎯 Core Features
- **Advanced AI Detection**: Real-time detection of AI patterns in text
- **Multiple Writing Styles**: Student, Blog, and Exam styles
- **API Integration**: Connect to OpenRouter for enhanced humanization
- **Local Processing**: All processing happens in your browser
- **Unlimited Conversions**: No daily limits (configurable)

### 🛠️ Technical Features
- **Local Storage**: Saves your API keys and preferences
- **Usage Tracking**: Monitor daily and total conversions
- **Export Options**: Copy, download, and share humanized text
- **Quality Indicators**: Real-time quality scoring
- **Responsive Design**: Works on all devices

## Setup Instructions

### Option 1: Quick Start (No API)
1. Simply open `index.html` in your browser
2. Paste AI-generated text
3. Select a writing style
4. Click "Humanize Text"

### Option 2: With OpenRouter API
1. Get an API key from [OpenRouter](https://openrouter.ai)
2. Click "API Settings" in the top-right corner
3. Enter your API key and model (default: sao10k/l3-lunaris-8b)
4. Click "Save Configuration"
5. Click "Test API Connection" to verify

## Configuration

Edit the `.env` file to customize:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=sao10k/l3-lunaris-8b

# Application Settings
MAX_CONVERSIONS_PER_DAY=100
ENABLE_FALLBACK_MODE=true