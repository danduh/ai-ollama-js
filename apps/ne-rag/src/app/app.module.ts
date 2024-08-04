import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlamaIndexController } from './controllers/llama.controller';
import { LlamaIndexService } from './rag/rag.service';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ ConfigModule.forRoot() ],
  controllers: [ AppController, LlamaIndexController ],
  providers: [ AppService, LlamaIndexService ]
})
export class AppModule {
}
