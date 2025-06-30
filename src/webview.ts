import * as vscode from 'vscode';

export function showExplanationPanel(context: vscode.ExtensionContext, code: string, explanation: string): void {
    // Create and show panel
    const panel = vscode.window.createWebviewPanel(
        'aiCodeExplanation',
        '🤖 AI Code Explanation',
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: []
        }
    );

    // Set the webview's HTML content
    panel.webview.html = getWebviewContent(code, explanation);

    // Handle disposal
    panel.onDidDispose(() => {
        console.log('Explanation panel disposed');
    }, null, context.subscriptions);

    // Handle messages from webview (for future enhancements)
    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'copy':
                    vscode.env.clipboard.writeText(message.text);
                    vscode.window.showInformationMessage('Copied to clipboard!');
                    return;
            }
        },
        undefined,
        context.subscriptions
    );
}

function getWebviewContent(code: string, explanation: string): string {
    // Escape HTML to prevent XSS
    const escapedCode = escapeHtml(code);
    const escapedExplanation = escapeHtml(explanation);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Code Explanation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--vscode-font-family), 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: var(--vscode-font-size, 14px);
            line-height: 1.6;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--vscode-panel-border);
        }
        
        .header h1 {
            font-size: 24px;
            color: var(--vscode-titleBar-activeForeground);
            margin-left: 10px;
        }
        
        .section {
            margin-bottom: 30px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .section-header {
            background-color: var(--vscode-titleBar-activeBackground);
            color: var(--vscode-titleBar-activeForeground);
            padding: 12px 16px;
            font-weight: 600;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .copy-btn {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        }
        
        .copy-btn:hover {
            background: var(--vscode-button-hoverBackground);
        }
        
        .section-content {
            background-color: var(--vscode-editor-background);
            padding: 16px;
        }
        
        .code-block {
            background-color: var(--vscode-textCodeBlock-background);
            border: 1px solid var(--vscode-textBlockQuote-border);
            border-radius: 6px;
            padding: 16px;
            font-family: var(--vscode-editor-font-family), 'Consolas', 'Courier New', monospace;
            font-size: var(--vscode-editor-font-size, 14px);
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .explanation-content {
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textLink-foreground);
            padding: 16px;
            white-space: pre-wrap;
            line-height: 1.7;
        }
        
        .explanation-content h2 {
            color: var(--vscode-textLink-foreground);
            margin: 20px 0 10px 0;
            font-size: 18px;
        }
        
        .explanation-content h3 {
            color: var(--vscode-textPreformat-foreground);
            margin: 15px 0 8px 0;
            font-size: 16px;
        }
        
        .explanation-content p {
            margin: 10px 0;
        }
        
        .explanation-content ul, .explanation-content ol {
            margin: 10px 0 10px 20px;
        }
        
        .explanation-content li {
            margin: 5px 0;
        }
        
        .explanation-content code {
            background-color: var(--vscode-textCodeBlock-background);
            padding: 2px 4px;
            border-radius: 3px;
            font-family: var(--vscode-editor-font-family), 'Consolas', monospace;
        }
        
        .stats {
            margin-top: 20px;
            padding: 12px;
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            border-radius: 6px;
            font-size: 12px;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 20px;
            }
            
            .section-content {
                padding: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span style="font-size: 28px;">🤖</span>
            <h1>AI Code Explanation</h1>
        </div>
        
        <div class="section">
            <div class="section-header">
                <span>📝 Selected Code</span>
                <button class="copy-btn" onclick="copyToClipboard('code')">Copy Code</button>
            </div>
            <div class="section-content">
                <div class="code-block" id="code-content">${escapedCode}</div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-header">
                <span>🧠 AI Analysis</span>
                <button class="copy-btn" onclick="copyToClipboard('explanation')">Copy Explanation</button>
            </div>
            <div class="section-content">
                <div class="explanation-content" id="explanation-content">${formatExplanation(escapedExplanation)}</div>
            </div>
        </div>
        
        <div class="stats">
            Code Length: ${code.length} characters | 
            Generated on: ${new Date().toLocaleString()}
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function copyToClipboard(type) {
            let text = '';
            if (type === 'code') {
                text = document.getElementById('code-content').textContent;
            } else if (type === 'explanation') {
                text = document.getElementById('explanation-content').textContent;
            }
            
            vscode.postMessage({
                command: 'copy',
                text: text
            });
        }
        
        // Add click handlers for better UX
        document.addEventListener('DOMContentLoaded', function() {
            const copyButtons = document.querySelectorAll('.copy-btn');
            copyButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    this.textContent = 'Copied!';
                    setTimeout(() => {
                        this.textContent = this.textContent.includes('Code') ? 'Copy Code' : 'Copy Explanation';
                    }, 2000);
                });
            });
        });
    </script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
    // Server-side HTML escaping for VS Code webview
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatExplanation(explanation: string): string {
    // Convert markdown-like formatting to HTML
    return explanation
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^#{1}\s(.+)$/gm, '<h2>$1</h2>')
        .replace(/^#{2}\s(.+)$/gm, '<h3>$1</h3>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/, '<p>$1</p>');
}