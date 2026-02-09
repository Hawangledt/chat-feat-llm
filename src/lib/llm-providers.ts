
interface LLMProvider {
    name: string;
    endpoint?: string;
    headers: Record<string, string>;
    body: (message: string) => any;
    parseResponse: (response: any) => string;
}

export const LLM_PROVIDERS: Record<string, LLMProvider > = {
    gemini: {
        name: 'Gemini',
        endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        headers: {
            'Content-Type': 'application/json',
        },
        body: (message: string) => ({
            contents: [
                {
                    parts: [
                        {
                            text: message,
                        },
                    ],
                },
            ],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        }),
        parseResponse: (response: any) => {
            return response.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui gerar uma resposta.';
        },
  },
};

export const getProvider = (): LLMProvider => {
    const providerName = process.env.LLM_PROVIDER || 'gemini';
    const provider = LLM_PROVIDERS[providerName];

    if (!provider) {
        throw new Error(`Provedor LLM "${providerName}" não encontrado. Verifique a configuração.`);
    }

    return provider;
};