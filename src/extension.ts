import * as vscode from 'vscode';
import { explainCodeWithAI } from './aiService';
import { showExplanationPanel } from './webview';

export function activate(context: vscode.ExtensionContext) {
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
            const apiKey = config.get<string>('geminiApiKey');
            
            if (!apiKey) {
                const action = await vscode.window.showErrorMessage(
                    'Gemini API key not configured. Please set it in settings.',
                    'Open Settings'
                );
                
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
                    const explanation = await explainCodeWithAI(selectedText);
                    progress.report({ increment: 100, message: "Complete!" });
                    
                    // Show the explanation in a webview panel
                    showExplanationPanel(context, selectedText, explanation);
                    
                    // Show success message
                    vscode.window.showInformationMessage('✅ Code explanation generated successfully!');
                    
                } catch (error) {
                    console.error('Error getting AI explanation:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    vscode.window.showErrorMessage(`Failed to get explanation: ${errorMessage}`);
                }
            });

        } catch (error) {
            console.error('Command execution error:', error);
            vscode.window.showErrorMessage('An unexpected error occurred. Please try again.');
        }
    });

    context.subscriptions.push(disposable);
    
    // Show activation message
    vscode.window.showInformationMessage('🤖 AI Code Explainer is ready! Select code and right-click to explain.');
}

export function deactivate() {
    console.log('AI Code Explainer extension deactivated');
}