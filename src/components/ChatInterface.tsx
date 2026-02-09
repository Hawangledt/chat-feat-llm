'use client'

import { useState } from 'react'

interface Message {
    id: string
    content: string
    isUser: boolean
    timestamp: Date
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const addMessage = (content: string, isUser: boolean): Message => {
        const message: Message = {
            id: Date.now().toString(),
            content,
            isUser,
            timestamp: new Date(),
        };
    
        setMessages(prev => [...prev, message]);
        return message;
    };

    const handleSendMessage = async () => {
        if (isLoading || !input.trim()) return;

        const messageContent = input.trim();
        setInput('');
        setError(null);
        
        // Adicionar mensagem do usuário
        addMessage(messageContent, true);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageContent }),
            });

            if (!response.ok) {
                let errorMessage = 'Erro ao processar mensagem';

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    // Se a resposta não for JSON, manter a mensagem de erro genérica
                }

                throw new Error(errorMessage);
            }
        
            const data = await response.json();

            // Adicionar a resposta da LLM
            addMessage(data.response, false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro na API');
            addMessage('Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.', false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 text-center">
                <h1 className="text-xl font-semibold">Chat com LLM</h1>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        Envie uma mensagem para começar a conversar
                    </div>
                )}
                
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.isUser
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                                message.isUser ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                                {message.timestamp.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                            <p>...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="border-t bg-gray-50 p-4">
                {error && (
                    <div className="mb-2 p-2 bg-red-100 border border-red-300 text-red-700 rounded">
                        {error}
                    </div>
                )}
                
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    )
}