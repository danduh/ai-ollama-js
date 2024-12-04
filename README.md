# NeAi

This project should help to develop and test much faster with GenAI in ming.  

Main functionalities. 

RAG. 

# Get Started

## Ollama
> Ollama is a tool designed to simplify the installation and management of large language models on local systems.

Install ollama first: https://ollama.com/download/linux

For Linux/Ubuntu/WSL2
```shell
curl -fsSL https://ollama.com/install.sh | sh
```

check that you have ollama installed

```shell
ollama --version

# To see possible commands run
ollama --help
```

We can use many models, and you can use any of them. Here is a [list of models](https://github.com/ollama/ollama/blob/main/README.md#model-library). 

But we will use llama3.2

So just pull the model over

```shell
ollama pull llama3.2
```

We can check all locally available models by running `ollama list`. 
```shell
NAME            ID              SIZE    MODIFIED           
llama3.2:latest 62757c860e01    4.7 GB  About a minute ago      
llama3:latest   a6990ed6be41    4.7 GB  2 months ago 
```

To run ollama use `run` command

```shell
ollama run llama3.2
```

Now you can communicate with the model :smile:
Type `/help` to see build in commands.

You can leave the terminal chat by using `/bye` command. 
