# Mini Chat com LLM

Uma aplicação de chat simples que conecta frontend web com LLMs através de API.

## 🚀 Funcionalidades

- **Interface de Chat**: Campo de texto, botão enviar, histórico de mensagens
- **Integração LLM**: Suporte para Gemini
- **Estado de Loading**: Indicador visual durante processamento
- **Tratamento de Erro**: Feedback para falhas de API, timeout e erros do backend

## 🛠️ Tecnologias

- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para styling
- **API Routes** para backend
- **Lucide React** para ícones

## 📦 Instalação

### 1. Clonar e instalar dependências

```bash
cd chat-feat-llm
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e configure suas chaves de API:

```bash
# Para Gemini
OPENAI_API_KEY=
LLM_PROVIDER=gemini
GEMINI_API_KEY=your-api-key-here

```

### 3. Executar aplicação

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

Acesse: http://localhost:3000

## 🏗️ Estrutura do Projeto

```
chat-feat-llm/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # Endpoint POST /chat
│   │   ├── globals.css               # Estilos globais
│   │   ├── layout.tsx               # Layout principal
│   │   └── page.tsx                 # Página inicial
│   ├── components/
│   │   ├── ChatInterface.tsx        # Interface principal do chat
│   ├── lib/
│   │   └── llm-providers.ts         # Configuração dos provedores LLM
├── .env.example                     # Exemplo de configuração
├── package.json
├── tailwind.config.js
└── README.md
```

## 📡 API Endpoints

### POST /api/chat

Envia mensagem para LLM e retorna resposta.

**Request:**
```json
{
  "message": "Olá, como você está?"
}
```

**Response:**
```json
{
  "reply": "Olá! Estou bem, obrigado por perguntar. Como posso ajudá-lo hoje?"
}
```

**Códigos de Status:**
- `200` - Sucesso
- `400` - Requisição inválida
- `500` - Erro interno do servidor

## 🔧 Configuração de Provedores LLM

### Google Gemini
1. Acesse https://makersuite.google.com/app/apikey
2. Crie uma nova chave de API
3. Configure `GEMINI_API_KEY` e `LLM_PROVIDER=gemini`

**Nota**: Certifique-se de que a API key do Gemini está ativada e tem as permissões necessárias. Se houver erro 400, verifique se:
- A chave está correta
- O modelo `gemini-1.5-flash` está disponível para sua conta
- A API Generative Language está habilitada no Google Cloud

## 🚨 Tratamento de Erros

A aplicação trata os seguintes cenários:

- **Timeout**: Requisições que demoram mais que 30s
- **API Key inválida**: Credenciais incorretas
- **Limite de rate**: Muitas requisições
- **Erro de rede**: Problemas de conectividade
- **Resposta inválida**: Formato inesperado da LLM

## 🧪 Desenvolvimento

```bash
# Verificação de tipos
npm run type-check

# Linting
npm run lint
```

## 📝 Licença

MIT