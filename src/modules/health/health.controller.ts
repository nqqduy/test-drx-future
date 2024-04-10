import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthService } from 'src/modules/health/health.service';
import { ResponseDto } from 'src/shares/dtos/response.dto';

@ApiTags('health')
@Controller('ping')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  async getHealth(): Promise<ResponseDto<Record<string, unknown>>> {
    return { data: await this.healthService.getHealth() };
  }
}
