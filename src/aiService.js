"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.explainCodeWithAI = void 0;
const axios_1 = __importDefault(require("axios"));
const vscode = __importStar(require("vscode"));
async function explainCodeWithAI(code) {
    try {
        // Get configuration
        const config = vscode.workspace.getConfiguration('aiCodeExplainer');
        const apiKey = config.get('geminiApiKey');
        const maxTokens = config.get('maxTokens') || 1000;
        if (!apiKey) {
            throw new Error('Gemini API key not configured. Please set it in VS Code settings.');
        }
        // Prepare the prompt
        const prompt = `You are an expert code analyst and programming tutor. Please analyze the following code and provide:

1. **Simple Explanation**: What does this code do in plain English?
2. **Step-by-step Breakdown**: How does it work?
3. **Key Concepts**: What programming concepts are used?
4. **Expert Tips**: Professional suggestions for improvement
5. **Potential Issues**: Any bugs or problems you notice

Code to analyze:
\`\`\`
${code}
\`\`\`

Please provide a clear, educational explanation suitable for both beginners and experienced developers.`;
        console.log('Sending request to Gemini API...');
        // Make API request
        const response = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            contents: [{
                    parts: [{
                            text: prompt
                        }]
                }],
            generationConfig: {
                temperature: 0.3,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: maxTokens,
                stopSequences: []
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });
        console.log('Received response from Gemini API');
        // Extract and validate response
        if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
            throw new Error('No response received from AI service');
        }
        const explanation = response.data.candidates[0]?.content?.parts?.[0]?.text;
        if (!explanation) {
            throw new Error('Empty response received from AI service');
        }
        return explanation;
    }
    catch (error) {
        console.error('AI Service Error:', error);
        if (axios_1.default.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Invalid API key. Please check your Gemini API key in settings.');
            }
            else if (error.response?.status === 429) {
                throw new Error('API rate limit exceeded. Please try again later.');
            }
            else if (error.response?.status === 403) {
                throw new Error('API access forbidden. Please check your API key permissions.');
            }
            else if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout. Please try again.');
            }
            else {
                throw new Error(`API request failed: ${error.response?.statusText || error.message}`);
            }
        }
        throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
}
exports.explainCodeWithAI = explainCodeWithAI;
//# sourceMappingURL=aiService.js.map