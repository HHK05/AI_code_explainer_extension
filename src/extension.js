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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const aiService_1 = require("./aiService");
const webview_1 = require("./webview");
function activate(context) {
    console.log('🤖 AI Code Explainer extension is now active!');
    // Register the explain code command
    let disposable = vscode.commands.registerCommand('ai-code-explainer.explainCode', async () => {
        try {
            console.log('Explain Code command triggered');
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found. Please open a file first.');
                return;
            }
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);
            if (!selectedText || selectedText.trim() === '') {
                vscode.window.showErrorMessage('Please select some code first, then right-click and choose "🤖 Explain Code with AI"');
                return;
            }
            // Check if API key is configured
            const config = vscode.workspace.getConfiguration('aiCodeExplainer');
            const apiKey = config.get('geminiApiKey');
            if (!apiKey) {
                const action = await vscode.window.showErrorMessage('Gemini API key not configured. Please set it in settings.', 'Open Settings');
                if (action === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'aiCodeExplainer.geminiApiKey');
                }
                return;
            }
            console.log(`Selected text length: ${selectedText.length} characters`);
            // Show progress notification
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "🤖 Getting AI explanation...",
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0, message: "Sending request to AI..." });
                try {
                    const explanation = await (0, aiService_1.explainCodeWithAI)(selectedText);
                    progress.report({ increment: 100, message: "Complete!" });
                    // Show the explanation in a webview panel
                    (0, webview_1.showExplanationPanel)(context, selectedText, explanation);
                    // Show success message
                    vscode.window.showInformationMessage('✅ Code explanation generated successfully!');
                }
                catch (error) {
                    console.error('Error getting AI explanation:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    vscode.window.showErrorMessage(`Failed to get explanation: ${errorMessage}`);
                }
            });
        }
        catch (error) {
            console.error('Command execution error:', error);
            vscode.window.showErrorMessage('An unexpected error occurred. Please try again.');
        }
    });
    context.subscriptions.push(disposable);
    // Show activation message
    vscode.window.showInformationMessage('🤖 AI Code Explainer is ready! Select code and right-click to explain.');
}
exports.activate = activate;
function deactivate() {
    console.log('AI Code Explainer extension deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map