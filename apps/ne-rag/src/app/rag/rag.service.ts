import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { Document, MetadataMode, NodeWithScore } from '@llamaindex/core/schema';
import {
  Ollama,
  serviceContextFromDefaults,
  Settings,
  SimpleVectorStore,
  storageContextFromDefaults,
  VectorStoreIndex
} from 'llamaindex';
import { ConfigService } from '@nestjs/config';
import * as console from 'node:console';
import { SimpleCodeDirectoryReader } from '../../utils/CodeFilesReader';
import { TSFileReader } from '../../utils/TSFileReader';

const ollama = new Ollama({ model: 'llama3.1', options: { temperature: 0.75 } });
// Use Ollama LLM and Embed Model
Settings.llm = ollama;
Settings.embedModel = ollama;

const serviceContext = serviceContextFromDefaults({
  llm: ollama,
  embedModel: ollama
});

@Injectable()
export class LlamaIndexService {
  constructor(private configService: ConfigService){


  }

  private readonly logger = new Logger(LlamaIndexService.name);

  private loadDirectory(directoryPath: string): Promise<Document[]>{
    const loader = new SimpleCodeDirectoryReader();
    return loader.loadData({ directoryPath });
  }

  private async loadDocument(path: string): Promise<Document[]>{
    const content = await fs.readFile(path);

    return  new TSFileReader().loadDataAsContent(content)
  }

  private async createIndex(documents: Document[]): Promise<VectorStoreIndex>{
    return await VectorStoreIndex.fromDocuments(documents);
  }

  async createPersistIndex(documents: Document[]){

    // create storage context
    // const storageContext = await storageContextFromDefaults({
    //   persistDir: './storage'
    // });
    // create index
    const index = await VectorStoreIndex.fromDocuments(documents, {
      serviceContext,
      // storageContext
    });
    return index;
  }


  async loadPersisIndex(){
    const storageContext = await storageContextFromDefaults({
      persistDir: './storage'
    });
    return await VectorStoreIndex.init({ storageContext, serviceContext });
  }

  public async queryIndex(query: string): Promise<{ response: string; sources: NodeWithScore[] }>{
    console.log('Loading data');
    const directoryPath = this.configService.get<string>('RAG_SOURCE_FOLDER') || '';
    // const loadedDocument = await this.loadDirectory(directoryPath);
    // const index = await this.createPersistIndex(loadedDocument);

    // console.log(loadedDocument);
    const documentPath = directoryPath + '/ts-test.cy.ts';
    const document = await this.loadDocument(documentPath);
    const index = await this.createIndex(document);



    // SimpleVectorStore.persistData('', index.docStore.persist())
    // const index = await this.loadIndex();
    console.log('Data Loaded');
    const queryEngine = index.asQueryEngine();
    const { response, sourceNodes } = await queryEngine.query({ query });

    this.logger.log(response);
    sourceNodes?.forEach((source: NodeWithScore, index: number) => {
      this.logger.log(
        `\n${index}: Score: ${source.score} - ${source.node
          .getContent(MetadataMode.NONE)
          .substring(0, 50)}...\n`
      );
    });

    return { response, sources: sourceNodes || [] };
  }
}
