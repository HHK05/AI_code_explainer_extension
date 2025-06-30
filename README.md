# 🤖 AI Code Explainer - VS Code Extension

**Effortlessly explain your code using AI, powered by Google Gemini.**  
This extension helps developers understand code by providing clear, AI-generated explanations directly within VS Code.

---

## ✨ Features

- ✅ Explain selected code in plain English  
- ✅ Step-by-step breakdown of code logic  
- ✅ Highlights key programming concepts  
- ✅ Expert improvement suggestions  
- ✅ Detects potential issues or bugs  
- ✅ Interactive webview with formatted, easy-to-read explanations  
- ✅ Copy-to-clipboard functionality for both code and explanations  

---

## 🛠 Requirements

- Visual Studio Code version **1.70.0** or higher  
- A valid **Google Gemini API Key** (Get one from [https://aistudio.google.com](https://aistudio.google.com))  

---

## ⚡ How It Works

1. **Select code** in your editor  
2. Right-click and choose **"🤖 Explain Code with AI"**  
3. The extension sends the selected code to the Gemini AI API  
4. An AI-generated explanation appears in an interactive webview panel  

---

## 🔧 Extension Settings

| Setting                          | Description                                           | Default |
|-----------------------------------|-------------------------------------------------------|---------|
| `aiCodeExplainer.geminiApiKey`    | Your Gemini API key for AI explanations               | `""`    |
| `aiCodeExplainer.maxTokens`       | Maximum tokens for AI responses (100 - 2000 allowed) | `1000`  |

You can configure these in your **VS Code Settings** or `settings.json`:

```json
"aiCodeExplainer.geminiApiKey": "YOUR_API_KEY_HERE",
"aiCodeExplainer.maxTokens": 1000
```
##🚀 Development Setup
1. Clone this repository:
  - *git clone https://github.com/HHK05/AI_code_explainer_extension.git*.
  - *cd AI_code_explainer_extension*.
2. Install dependencies:
  - npm install.
3. Compile the project:
  - npm run compile.
4. Launch the extension in a new VS Code window:
  - Press F5 to start debugging.
  - In the new window, select some code and right-click to use the AI Explainer.
## 🧩 Tech Stack
  - ✅ Visual Studio Code Extension API.
  - ✅ TypeScript.
  - ✅ Axios.
  - ✅ Google Gemini AI API.
  - ✅Interactive Webview with modern UI styling.
##📄 License
    # MIT License
    - © 2025 Harshil HK, SDE. 



