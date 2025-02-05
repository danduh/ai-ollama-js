import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MetadataMode, NodeWithScore } from '@llamaindex/core/schema';
import {
  HuggingFaceEmbedding,
  Ollama,
  Settings,
  storageContextFromDefaults,
  VectorStoreIndex,
} from 'llamaindex';
import { ConfigService } from '@nestjs/config';
import * as console from 'node:console';
import { SimpleDirectoryReader } from '@llamaindex/readers/directory';
import { StorageContext } from 'llamaindex/storage/StorageContext';
import { ChatMessage } from '@llamaindex/core/llms';

export const DATA_TYPES = {
  auto: 'auto',
  fp32: 'fp32',
  fp16: 'fp16',
  q8: 'q8',
  int8: 'int8',
  uint8: 'uint8',
  q4: 'q4',
  bnb4: 'bnb4',
  q4f16: 'q4f16',
} as const;

// Type for the values of DATA_TYPES
console.log('Initializing LLM settings');
Settings.llm = new Ollama({
  // model: 'llama3.2',
  model: 'llama3.2',
});
console.log('Initializing Embedding  settings');
Settings.embedModel = new HuggingFaceEmbedding({
  modelType: 'BAAI/bge-small-en-v1.5',
  modelOptions: { dtype: DATA_TYPES.fp32 },
});
console.log('Done');

@Injectable()
export class LlamaIndexService implements OnModuleInit {
  vectorIndex!: VectorStoreIndex;
  storageContext!: StorageContext;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.storageContext = await storageContextFromDefaults({
      persistDir: this.configService.get('RAG_VECTOR_PERSIST'),
    });

    await this.loadDirectory(
      this.configService.get('RAG_SOURCE_FOLDER') as string
    );
  }

  private readonly logger = new Logger(LlamaIndexService.name);

  private async loadDirectory(directoryPath: string): Promise<void> {
    console.log('Loading data', directoryPath);

    const loader = new SimpleDirectoryReader();
    const documents = await loader.loadData({ directoryPath });

    console.log(`Loaded ${documents.length} documents`);
    console.log(`Creating Vector Index`);

    this.vectorIndex = await VectorStoreIndex.fromDocuments(documents, {
      storageContext: this.storageContext,
    });

    console.log(`Vector Created`);
  }

  public async queryIndex(request: any): Promise<ChatMessage> {
    const { messages } = request;

    let userMessage = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userMessage = messages[i];
        break;
      }
    }
    const prompt = userMessage?.content;

    const queryEngine = this.vectorIndex.asQueryEngine();
    const { sourceNodes, message } = await queryEngine.query({
      query: prompt,
    });

    this.logger.log(message);


    sourceNodes?.forEach((source: NodeWithScore, index: number) => {
      console.log("SOURCE:", source)
      console.log("INDEX:", index)
      this.logger.log(
        `\n${index}: Score: ${source.score} - ${source.node
          .getContent(MetadataMode.NONE)
          .substring(0, 50)}...\n`
      );
    });

    return message;
  }
}
