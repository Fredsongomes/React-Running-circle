import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

export class HealthResponse {
  @ApiProperty({ example: 'ok' }) status: string;
  @ApiProperty({ example: 'Runner Circle API' }) name: string;
  @ApiProperty({ example: '/docs' }) docs: string;
}

@ApiTags('health')
@Controller()
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Healthcheck / info da API' })
  @ApiOkResponse({ type: HealthResponse })
  root(): HealthResponse {
    return {
      status: 'ok',
      name: 'Runner Circle API',
      docs: '/docs',
    };
  }
}
