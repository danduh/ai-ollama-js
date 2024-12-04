import { Module } from '@nestjs/common';

import { LlamaIndexController } from './controllers/llama.controller';
import { LlamaIndexService } from './rag/rag.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [LlamaIndexController],
  providers: [LlamaIndexService],
})
export class AppModule {}
