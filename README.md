# 🚀 Get Started

## 🛒 Checkout the Repository

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd <repo-name>
npm install
```

### ⚠️ **Important: Install Ollama First!** [See Installation Instructions](#install-ollama)

## 🧠 Local RAG Service

To start the **ne-rag** service, run:

```bash
nx serve ne-rag
```

This will start the service at:  
👉 [http://localhost:3000](http://localhost:3000)

## 💬 Chat Web UI

To launch the **Chat-Llama** web UI, run:

```bash
nx serve chat-llama
```

Then open your browser and go to:  
👉 [http://localhost:4200](http://localhost:4200)

You can now interact with the chat interface!

---

# 📥 Install Ollama

> Ollama is a tool designed to simplify the installation and management of large language models on local systems.

### 🖥️ Install Ollama

Download and install Ollama for your system:  
🔗 [Ollama Installation Guide](https://ollama.com/download/linux)

For **Linux/Ubuntu/WSL2**, run:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 🔍 Verify Installation

Check if Ollama is installed:

```bash
ollama --version
```

To see all available commands:

```bash
ollama --help
```

---

# 🧩 Using Ollama with Llama3.2

Ollama supports multiple models. You can check out the available models in the [Ollama Model Library](https://github.com/ollama/ollama/blob/main/README.md#model-library).

For this setup, we'll use **Llama3.2**.

### 📥 Download the Llama3.2 Model

```bash
ollama pull llama3.2
```

To list all downloaded models:

```bash
ollama list
```

Example output:

```bash
NAME            ID              SIZE    MODIFIED           
llama3.2:latest 62757c860e01    4.7 GB  About a minute ago      
```

### 🚀 Run the Model

To start the **Llama3.2** model:

```bash
ollama run llama3.2
```

Now you can communicate with the model! 😃

- Type `/help` to see built-in commands.
- Exit the chat using the `/bye` command.
