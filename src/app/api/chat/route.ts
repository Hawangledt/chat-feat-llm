import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/llm-providers';

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();
        
        if (!message) {
            return NextResponse.json(
                { error: 'Mensagem é obrigatória' },
                { status: 400 }
            );
        }

        const provider = getProvider();
        
        const response = await fetch(provider.endpoint!, {
            method: 'POST',
            headers: provider.headers,
            body: JSON.stringify(provider.body(message)),
        });

        if (response.status === 401) {
            return NextResponse.json(
                { error: 'Chave de API inválida' },
                { status: 401 }
            );
        }

        if (response.status === 429) {
            return NextResponse.json(
                { error: 'Muitas requisições' },
                { status: 429 }
            );
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Erro na API da LLM' },
                { status: 500 }
            );
        }

        const data = await response.json();
        const parsedResponse = provider.parseResponse(data);

        if (!parsedResponse || parsedResponse.trim() === '') {
            return NextResponse.json(
                { error: 'Resposta vazia da LLM' },
                { status: 500 }
            );
        }

        return NextResponse.json({ response: parsedResponse });

    } catch (error) {
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}