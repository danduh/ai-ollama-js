import { Controller, Post, Body, Get } from '@nestjs/common';
import { LlamaIndexService } from '../rag/rag.service';

@Controller('llamaindex/v1/')
export class LlamaIndexController {
  constructor(private readonly llamaIndexService: LlamaIndexService) {}

  @Get('')
  async get() {
    return {data: 'allgood'}
  }

  @Post('completions')
  async query(@Body() body: any) {
    const result = await this.llamaIndexService.queryIndex(body);
    return result;
  }
}
