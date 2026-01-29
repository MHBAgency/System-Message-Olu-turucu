import { useState } from 'react';
import { Upload, FileText, Trash2, X, Loader2, BookOpen } from 'lucide-react';
import { useStore } from '../store';
import type { KnowledgeFile } from '../types/knowledge';
import { getFileType, formatFileSize, FILE_SIZE_LIMIT } from '../types/knowledge';
import { parseFile } from '../utils/fileParsers';

interface KnowledgePanelProps {
    onClose?: () => void;
}

export const KnowledgePanel = ({ onClose }: KnowledgePanelProps) => {
    const { knowledgeFiles, addKnowledgeFile, removeKnowledgeFile, clearKnowledgeFiles } = useStore();
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [selectedFile, setSelectedFile] = useState<KnowledgeFile | null>(null);

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setIsUploading(true);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadProgress(`Processing ${file.name}...`);

            try {
                // Validate file size
                if (file.size > FILE_SIZE_LIMIT) {
                    alert(`${file.name} is too large. Max size is 10MB.`);
                    continue;
                }

                // Validate file type
                const fileType = getFileType(file.name);
                if (!fileType) {
                    alert(`${file.name} has unsupported format.`);
                    continue;
                }

                // Parse file content
                const content = await parseFile(file);

                // Create knowledge file
                const knowledgeFile: KnowledgeFile = {
                    id: crypto.randomUUID(),
                    name: file.name,
                    type: fileType,
                    size: file.size,
                    content,
                    uploadedAt: new Date(),
                    preview: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
                };

                addKnowledgeFile(knowledgeFile);
            } catch (error) {
                console.error('Error processing file:', error);
                alert(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        setIsUploading(false);
        setUploadProgress('');
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const getFileIcon = (type: KnowledgeFile['type']) => {
        switch (type) {
            case 'excel':
                return '📊';
            case 'word':
                return '📝';
            case 'pdf':
                return '📕';
            case 'text':
                return '📄';
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900">
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <BookOpen size={20} className="text-blue-400" />
                        <h2 className="text-lg font-semibold text-blue-400">Knowledge Base</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {knowledgeFiles.length > 0 && (
                            <button
                                onClick={clearKnowledgeFiles}
                                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                                title="Clear all"
                            >
                                Clear All
                            </button>
                        )}
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                                title="Close"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-sm text-gray-400">
                    {knowledgeFiles.length} file{knowledgeFiles.length !== 1 ? 's' : ''} uploaded
                </p>
            </div>

            {/* Upload Zone */}
            <div className="p-4 border-b border-gray-800">
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging
                        ? 'border-green-500 bg-green-900/20'
                        : 'border-gray-700 hover:border-gray-600'
                        }`}
                >
                    <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400 mb-2">
                        Drag & drop files here or
                    </p>
                    <label className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                        Browse Files
                        <input
                            type="file"
                            multiple
                            accept=".xlsx,.xls,.csv,.docx,.pdf,.txt"
                            onChange={(e) => handleFileSelect(e.target.files)}
                            className="hidden"
                        />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                        Excel, Word, PDF, Text (Max 10MB)
                    </p>
                </div>

                {isUploading && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                        <Loader2 size={16} className="animate-spin" />
                        <span>{uploadProgress}</span>
                    </div>
                )}
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto p-4">
                {knowledgeFiles.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <FileText size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No files uploaded yet</p>
                        <p className="text-xs mt-1">Upload files to enhance AI responses</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {knowledgeFiles.map((file) => (
                            <div
                                key={file.id}
                                className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-green-500 transition-colors cursor-pointer"
                                onClick={() => setSelectedFile(file)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-2 flex-1">
                                        <span className="text-2xl">{getFileIcon(file.type)}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {formatFileSize(file.size)} • {file.type}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {file.preview}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeKnowledgeFile(file.id);
                                        }}
                                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                                        title="Remove"
                                    >
                                        <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {selectedFile && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">{selectedFile.name}</h3>
                                <p className="text-sm text-gray-400">
                                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                                {selectedFile.content}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
