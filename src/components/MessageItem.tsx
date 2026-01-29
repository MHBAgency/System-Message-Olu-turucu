```typescript
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useStore, type Message } from '../store';
import { optimizePrompt } from '../services/ai';

interface MessageItemProps {
    message: Message;
}

export const MessageItem = ({ message }: MessageItemProps) => {
    const { setMessageFeedback, messages, currentPrompt, apiKey, setPendingOptimization, setOptimizing } = useStore();
    const [showAnnotation, setShowAnnotation] = useState(false);
    const [annotation, setAnnotation] = useState('');

    const handleBadFeedback = async () => {
        setMessageFeedback(message.id, 'bad');
        setShowAnnotation(true);
    };

    const handleAnnotationSubmit = async () => {
        if (!annotation.trim()) return;

        setMessageFeedback(message.id, 'bad', annotation);
        setShowAnnotation(false);
        setOptimizing(true);

        try {
            // Find the user message that came before this AI response
            const messageIndex = messages.findIndex(m => m.id === message.id);
            const userMessage = messages[messageIndex - 1];

            if (!userMessage || userMessage.role !== 'user') {
                throw new Error('Kullanıcı mesajı bulunamadı');
            }

            const history = messages.slice(0, messageIndex - 1).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const result = await optimizePrompt(
                currentPrompt,
                history,
                {
                    user: userMessage.content,
                    ai: message.content,
                    annotation: annotation.trim()
                },
                apiKey
            );

            setPendingOptimization(JSON.stringify(result, null, 2));
        } catch (error) {
            console.error('Optimization error:', error);
            alert('Optimizasyon hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
        } finally {
            setOptimizing(false);
        }
    };

    const isUser = message.role === 'user';

    return (
        <div className={`flex ${ isUser ? 'justify-end' : 'justify-start' } animate - fade -in `}>
            <div className={`max - w - [80 %] ${ isUser ? 'order-2' : 'order-1' } `}>
                <div
                    className={`px - 4 py - 3 rounded - lg ${
    isUser ? 'message-user' : 'message-ai'
} `}
                >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Feedback buttons - only for AI messages */}
                {!isUser && (
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={() => setMessageFeedback(message.id, 'good')}
                            className={`p - 1.5 rounded hover: bg - gray - 800 transition - colors ${
    message.feedback === 'good' ? 'text-green-500' : 'text-gray-500'
} `}
                            title="İyi yanıt"
                        >
                            <ThumbsUp size={16} />
                        </button>
                        <button
                            onClick={handleBadFeedback}
                            className={`p - 1.5 rounded hover: bg - gray - 800 transition - colors ${
    message.feedback === 'bad' ? 'text-red-500' : 'text-gray-500'
} `}
                            title="Kötü yanıt"
                        >
                            <ThumbsDown size={16} />
                        </button>
                        {message.annotation && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <MessageSquare size={12} />
                                {message.annotation}
                            </span>
                        )}
                    </div>
                )}

                {/* Annotation modal */}
                {showAnnotation && (
                    <div className="mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg animate-slide-up">
                        <p className="text-sm text-gray-300 mb-2">Bu yanıtta ne yanlış oldu?</p>
                        <textarea
                            value={annotation}
                            onChange={(e) => setAnnotation(e.target.value)}
                            placeholder="Örn: Çok resmi bir dil kullandı"
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500 resize-none"
                            rows={3}
                            autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={handleAnnotationSubmit}
                                disabled={!annotation.trim()}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded text-sm transition-colors"
                            >
                                Prompt'u İyileştir
                            </button>
                            <button
                                onClick={() => setShowAnnotation(false)}
                                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
