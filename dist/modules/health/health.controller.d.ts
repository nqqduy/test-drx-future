import { HealthService } from 'src/modules/health/health.service';
import { ResponseDto } from 'src/shares/dtos/response.dto';
export declare class HealthController {
    private healthService;
    constructor(healthService: HealthService);
    getHealth(): Promise<ResponseDto<Record<string, unknown>>>;
}
