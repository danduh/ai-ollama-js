# 🎓 Workshop: Running LLM, RAG, and AI on Your Local Machine

## 📋 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Understanding RAG (Retrieval-Augmented Generation)](#understanding-rag-retrieval-augmented-generation)
- [How This RAG Implementation Works](#how-this-rag-implementation-works)
- [Running the Applications](#running-the-applications)
- [Architecture Overview](#architecture-overview)
- [Code References](#code-references)

---

## 🎯 Overview

This repository demonstrates how to run **Large Language Models (LLMs)** with **Retrieval-Augmented Generation (RAG)** entirely on your local machine. Perfect for workshops, learning, and understanding how modern AI applications work without relying on cloud APIs.

**What you'll learn:**
- Setting up local LLMs using Ollama
- Building RAG systems with LlamaIndex
- Creating vector embeddings and indexes
- Querying documents with semantic search
- Building a chat interface for your RAG system

---

## ✅ Prerequisites

Before starting, ensure you have:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python 3.13** (for embedding models) - [Download](https://www.python.org/)
- **Git** - [Download](https://git-scm.com/)
- **8GB+ RAM** recommended
- **10GB+ free disk space** for models

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repo-url>
cd ai-ollama-js
npm install
```

### Step 2: Install Ollama

> **⚠️ Critical:** Ollama must be installed before running the RAG service!

Ollama is a tool that simplifies running large language models locally.

**For macOS:**
```bash
brew install ollama
```

**For Linux/Ubuntu/WSL2:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**For Windows:**
Download from [Ollama Downloads](https://ollama.com/download)

**Verify Installation:**
```bash
ollama --version
```

### Step 3: Download Required Models

This project uses **Llama 3.1 (8B)** and **Llama 3.2** models:

```bash
# Primary RAG model (used for embeddings and query processing)
ollama pull llama3.1:8b

# Assistant model (used for chat)
ollama pull llama3.2
```

**Verify models are downloaded:**
```bash
ollama list
```

Expected output:
```
NAME              ID              SIZE      MODIFIED
llama3.1:8b       <id>           4.7 GB    ...
llama3.2:latest   <id>           4.7 GB    ...
```

### Step 4: Setup Python Environment with uv

The project uses HuggingFace embeddings which require Python. We use **uv** - a fast Python package installer.

**Install uv:**
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or via pip
pip install uv
```

**Setup Python environment:**
```bash
# Create virtual environment with uv
uv venv localenv

# Activate the environment
source localenv/bin/activate  # On Windows: localenv\Scripts\activate

# Install dependencies with uv (much faster than pip!)
uv pip install transformers torch numpy
```

**Why uv?**
- ⚡ 10-100x faster than pip
- 🔒 Built-in dependency resolution
- 🎯 Compatible with pip requirements

### Step 5: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# RAG Configuration
RAG_SOURCE_FOLDER=./documents
RAG_VECTOR_PERSIST=./ragpersist

# Server Configuration
PORT=3000
```

### Step 6: Prepare Your Documents

Place your documents in the `documents/` folder:
```bash
mkdir -p documents
# Add your .txt, .md, or other text files here
```

---

## 🧠 Understanding RAG (Retrieval-Augmented Generation)

### What is RAG?

**RAG** combines two powerful concepts:
1. **Retrieval**: Finding relevant information from a knowledge base
2. **Generation**: Using an LLM to generate responses based on retrieved context

**Why RAG?**
- LLMs have knowledge cutoff dates
- Hallucinations when answering specific questions
- No access to private/proprietary data
- RAG solves these by grounding responses in your actual documents

### RAG Architecture Diagram

![RAG Architecture](images/rag-architecture.png)

The diagram above shows the complete RAG system architecture with two main flows:

#### 📥 RAG Creation Flow (Left Side - Indexing Phase)

This is the **preparation phase** where we build our knowledge base:

1. **Static Knowledge Source**: Your documents (`.txt`, `.md`, etc.)
2. **Injection**: Documents are loaded into the system
3. **Parsing → Cleaning → Embedding Generation**: 
   - Documents are parsed and cleaned
   - Split into smaller chunks for better retrieval
   - Each chunk is converted to vector embeddings using the embedding model
4. **Vector DB**: Embeddings are stored in a vector database for fast similarity search
5. **Intent Classification**: System can identify different types of queries (OpenAI/Reason, User, Assistants, PayOut, Financial/Outdoor e.g. Account Numbers)

#### 💬 Chat Flow (Right Side - Query Phase)

This is the **user interaction phase** where queries are answered:

1. **User**: Submits a question through the chat interface
2. **AI Agent/Router**: 
   - Analyzes the query type (General, Chat Trigger, AI Response, Query)
   - Routes to appropriate processing pipeline
3. **Chat Service**: Coordinates the RAG pipeline
4. **Query RAG**: Performs semantic search in Vector DB
5. **Parsing → Cleaning → Summarization**: 
   - Retrieved chunks are processed
   - Most relevant results are selected and ranked
6. **Prompt Crafting**: 
   - System prompt is created
   - Most relevant results are combined with user query
   - Custom instructions for the LLM
7. **Main LLM** (OpenAI/Azure/etc): Generates the final response using:
   - Retrieved context from documents
   - User's original question
   - System instructions
8. **AI Response**: Returns answer to the user

### Key RAG Features

**During Indexing:**
- Documents are split into manageable chunks
- Each chunk gets a vector embedding (numerical representation)
- Stored for fast semantic search

**During Querying:**
- User query is converted to the same vector space
- Similar document chunks are retrieved
- LLM uses these chunks as context
- Response is grounded in actual documents

**Advanced Features:**
- **Query Analysis**: Understands query intent and complexity
- **Query Routing**: Different query types handled differently
- **Intent Classification**: Categorizes queries for specialized handling
- **Reranking**: Scores retrieved documents by relevance
- **Response Synthesis**: Combines multiple sources coherently

---

## 🔧 How This RAG Implementation Works

### Architecture Components

Our implementation uses:
- **LlamaIndex**: RAG orchestration framework
- **Ollama**: Local LLM runtime (Llama 3.1:8b, Llama 3.2)
- **HuggingFace Embeddings**: BAAI/bge-small-en-v1.5 model
- **Vector Store**: Persistent local storage
- **NestJS**: Backend API framework

### The RAG Pipeline

#### 1. **Initialization** ([rag.service.ts](apps/ne-rag/src/app/rag/rag.service.ts#L28-L39))

```typescript
// Configure the LLM
Settings.llm = new Ollama({
  model: 'llama3.1:8b',
});

// Configure embeddings
Settings.embedModel = new HuggingFaceEmbedding({
  modelType: 'BAAI/bge-small-en-v1.5',
  modelOptions: { dtype: DATA_TYPES.fp32 },
});
```

**What happens:**
- Sets up Llama 3.1:8b as the primary language model
- Configures BAAI/bge-small-en-v1.5 for creating vector embeddings
- Uses FP32 precision for accuracy

#### 2. **Document Loading** ([rag.service.ts](apps/ne-rag/src/app/rag/rag.service.ts#L86-L100))

```typescript
private async loadDirectory(directoryPath: string): Promise<void> {
  const loader = new SimpleDirectoryReader();
  const documents = await loader.loadData({ directoryPath });
  
  this.vectorIndex = await VectorStoreIndex.fromDocuments(documents, {
    storageContext: this.storageContext,
  });
}
```

**What happens:**
- Reads all documents from the configured folder
- Splits documents into chunks
- Creates vector embeddings for each chunk
- Stores embeddings in the vector database
- Persists to disk for future use

#### 3. **Query Processing** ([rag.service.ts](apps/ne-rag/src/app/rag/rag.service.ts#L102-L127))

```typescript
public async queryIndex(request: any): Promise<ChatMessage> {
  const prompt = userMessage?.content;
  
  const queryEngine = this.vectorIndex.asQueryEngine();
  const { sourceNodes, message } = await queryEngine.query({
    query: prompt,
  });
  
  return message;
}
```

**What happens:**
1. Receives user query
2. Converts query to vector embedding
3. Searches vector database for similar chunks (semantic search)
4. Retrieves top K most relevant document chunks
5. Creates augmented prompt: [Context] + [User Query]
6. Sends to LLM for response generation
7. Returns response with source attribution

#### 4. **API Endpoint** ([llama.controller.ts](apps/ne-rag/src/app/controllers/llama.controller.ts#L13-L18))

```typescript
@Post('completions')
async query(@Body() body: any) {
  const message = await this.llamaIndexService.queryIndex(body);
  return message.content;
}
```

**What happens:**
- Exposes REST API at `/api/llamaindex/v1/completions`
- Accepts chat messages in OpenAI-compatible format
- Returns generated response

### Key Features

✅ **Persistent Storage**: Vector index is saved and reloaded ([rag.service.ts](apps/ne-rag/src/app/rag/rag.service.ts#L54-L56))
✅ **Source Attribution**: Returns which documents contributed to the answer ([rag.service.ts](apps/ne-rag/src/app/rag/rag.service.ts#L119-L125))
✅ **Configurable Models**: Easy to swap LLM models ([rag.service.ts](apps/ne-rag/src/app/rag/rag.service.ts#L30-L32))
✅ **Simple Chat Mode**: Also supports direct LLM chat without RAG ([rag.service.ts](apps/ne-rag/src/app/rag/rag.service.ts#L62-L82))

---

## 🏃 Running the Applications

### Start the RAG Backend Service

```bash
nx serve ne-rag
```

**Service URL:** [http://localhost:3000](http://localhost:3000)

**Logs to watch for:**
```
Initializing LLM settings
Initializing Embedding settings
Done
Loading data ./documents
Loaded X documents
Creating Vector Index
Vector Created
🚀 Application is running on: http://localhost:3000/api
```

### Start the Chat Web Interface

```bash
nx serve chat-llama
```

**Web UI:** [http://localhost:4200](http://localhost:4200)

Now you can chat with your documents! 🎉

### Testing the API Directly

```bash
curl -X POST http://localhost:3000/api/llamaindex/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What is this project about?"}
    ]
  }'
```

---

## 🏗️ Architecture Overview

### Project Structure

```
ai-ollama-js/
├── apps/
│   ├── ne-rag/              # RAG Backend Service
│   │   └── src/
│   │       ├── main.ts      # Application entry point
│   │       └── app/
│   │           ├── app.module.ts          # NestJS module configuration
│   │           ├── controllers/
│   │           │   └── llama.controller.ts  # REST API endpoints
│   │           └── rag/
│   │               └── rag.service.ts       # Core RAG implementation
│   │
│   └── chat-llama/          # Chat Web UI
│       └── src/
│           └── main.tsx     # React application
│
├── documents/               # Your knowledge base (add files here)
├── ragpersist/             # Vector index storage
└── localenv/               # Python virtual environment
```

### Technology Stack

**Backend:**
- NestJS - TypeScript backend framework
- LlamaIndex - RAG orchestration
- Ollama - LLM runtime

**Frontend:**
- React - UI framework
- Nx - Monorepo tooling

**AI/ML:**
- Llama 3.1:8b - Primary LLM
- Llama 3.2 - Assistant LLM
- BAAI/bge-small-en-v1.5 - Embedding model

---

## 📚 Code References

### Core RAG Implementation

| Component | File | Lines | Description |
|-----------|------|-------|-------------|
| **LLM Configuration** | [rag.service.ts](apps/ne-rag/src/app/rag/rag.service.ts) | [28-39](apps/ne-rag/src/app/rag/rag.service.ts#L28-L39) | Sets up Ollama LLM and HuggingFace embeddings |
| **Service Initialization** | [rag.service.ts](apps/ne-rag/src/app/rag/rag.service.ts) | [48-60](apps/ne-rag/src/app/rag/rag.service.ts#L48-L60) | Initializes assistant model, storage context, and loads documents |
| **Document Loading** | [rag.service.ts](apps/ne-rag/src/app/rag/rag.service.ts) | [86-100](apps/ne-rag/src/app/rag/rag.service.ts#L86-L100) | Reads documents and creates vector index |
| **Query Processing** | [rag.service.ts](apps/ne-rag/src/app/rag/rag.service.ts) | [102-127](apps/ne-rag/src/app/rag/rag.service.ts#L102-L127) | Handles user queries with RAG pipeline |
| **Simple Chat** | [rag.service.ts](apps/ne-rag/src/app/rag/rag.service.ts) | [62-82](apps/ne-rag/src/app/rag/rag.service.ts#L62-L82) | Direct LLM chat without RAG |

### API Layer

| Component | File | Lines | Description |
|-----------|------|-------|-------------|
| **REST Controller** | [llama.controller.ts](apps/ne-rag/src/app/controllers/llama.controller.ts) | [4-20](apps/ne-rag/src/app/controllers/llama.controller.ts#L4-L20) | Defines API endpoints |
| **Module Configuration** | [app.module.ts](apps/ne-rag/src/app/app.module.ts) | [1-12](apps/ne-rag/src/app/app.module.ts#L1-L12) | NestJS module setup |
| **Application Bootstrap** | [main.ts](apps/ne-rag/src/main.ts) | [12-28](apps/ne-rag/src/main.ts#L12-L28) | Server startup and configuration |

### Models Used

| Model | Purpose | Size | Configuration |
|-------|---------|------|---------------|
| **llama3.1:8b** | Primary RAG LLM | ~4.7GB | [rag.service.ts:32](apps/ne-rag/src/app/rag/rag.service.ts#L32) |
| **llama3.2** | Chat assistant | ~4.7GB | [rag.service.ts:51](apps/ne-rag/src/app/rag/rag.service.ts#L51) |
| **BAAI/bge-small-en-v1.5** | Embeddings | ~133MB | [rag.service.ts:35-37](apps/ne-rag/src/app/rag/rag.service.ts#L35-L37) |

---

## 🎓 Workshop Tips

### For Presenters

1. **Start Simple**: Show basic LLM chat first, then introduce RAG
2. **Live Demo**: Add a document to `documents/` and restart the service
3. **Show Source Attribution**: Demonstrate how RAG cites sources
4. **Compare Responses**: Query with and without RAG to show the difference

### For Participants

1. **Experiment**: Try different documents in your knowledge base
2. **Monitor Logs**: Watch the console for vector creation and retrieval
3. **Test Queries**: Ask questions that require your documents
4. **Compare Models**: Try different Ollama models

---

## 🐛 Troubleshooting

**Issue**: "Ollama not found"
- **Solution**: Install Ollama and verify with `ollama --version`

**Issue**: "Model not found"
- **Solution**: Run `ollama pull llama3.1:8b` and `ollama pull llama3.2`

**Issue**: "Python/transformers errors"
- **Solution**: Activate virtual environment and install dependencies

**Issue**: "Out of memory"
- **Solution**: Use smaller models or reduce document size

---

## 📖 Additional Resources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [LlamaIndex Documentation](https://docs.llamaindex.ai/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Understanding RAG](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [Vector Embeddings Explained](https://www.pinecone.io/learn/vector-embeddings/)

---

## 📄 License

MIT

---

**Happy Learning! 🚀**

*This workshop demonstrates the power of running AI locally - no cloud APIs, no API keys, just your machine and open-source tools.*
