import type { Message, PromptVersion } from '../store';

// Export current prompt as Markdown
export const exportAsMarkdown = (
    prompt: string,
    versions: PromptVersion[]
): string => {
    const now = new Date().toLocaleDateString('tr-TR');

    let markdown = `# System Prompt\n\n`;
    markdown += `**Oluşturulma Tarihi:** ${now}\n\n`;
    markdown += `---\n\n`;
    markdown += `## Aktif Prompt\n\n`;
    markdown += `\`\`\`\n${prompt}\n\`\`\`\n\n`;

    if (versions.length > 0) {
        markdown += `---\n\n`;
        markdown += `## Versiyon Geçmişi\n\n`;

        versions.reverse().forEach((version, index) => {
            markdown += `### Version ${versions.length - index}\n`;
            markdown += `**Tarih:** ${new Date(version.timestamp).toLocaleString('tr-TR')}\n`;
            if (version.reason) {
                markdown += `**Değişiklik:** ${version.reason}\n`;
            }
            markdown += `\n\`\`\`\n${version.content}\n\`\`\`\n\n`;
        });
    }

    return markdown;
};

// Export as JSON
export const exportAsJSON = (
    prompt: string,
    versions: PromptVersion[],
    messages: Message[]
): string => {
    const data = {
        exportedAt: new Date().toISOString(),
        currentPrompt: prompt,
        versions: versions.map((v) => ({
            content: v.content,
            timestamp: v.timestamp,
            reason: v.reason,
        })),
        conversations: messages.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
            feedback: m.feedback,
            annotation: m.annotation,
        })),
        stats: {
            totalMessages: messages.length,
            totalVersions: versions.length,
            positiveFeedback: messages.filter((m) => m.feedback === 'good').length,
            negativeFeedback: messages.filter((m) => m.feedback === 'bad').length,
        },
    };

    return JSON.stringify(data, null, 2);
};

// Export as N8N Format (simple text format)
export const exportForN8N = (prompt: string): string => {
    return prompt;
};

// Download file helper
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Export functions with download
export const downloadMarkdown = (prompt: string, versions: PromptVersion[]): void => {
    const markdown = exportAsMarkdown(prompt, versions);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(markdown, `system-prompt-${timestamp}.md`, 'text/markdown');
};

export const downloadJSON = (
    prompt: string,
    versions: PromptVersion[],
    messages: Message[]
): void => {
    const json = exportAsJSON(prompt, versions, messages);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(json, `system-prompt-export-${timestamp}.json`, 'application/json');
};

export const downloadN8NFormat = (prompt: string): void => {
    const content = exportForN8N(prompt);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(content, `system-prompt-n8n-${timestamp}.txt`, 'text/plain');
};
