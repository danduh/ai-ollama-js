import { Controller, Post, Body, Get } from '@nestjs/common';
import { LlamaIndexService } from '../rag/rag.service';

@Controller('llamaindex')
export class LlamaIndexController {
  constructor(private readonly llamaIndexService: LlamaIndexService) {}

  @Get('')
  async get() {
    return {data: 'allgood'}
  }

  @Post('query')
  async query(@Body('prompt') prompt: string) {
    const result = await this.llamaIndexService.queryIndex(prompt);
    return result;
  }
}
