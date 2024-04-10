import { Registry } from 'prom-client';
import { MetricsService } from './metrics.service';
export declare class MetricsController {
    private registry;
    private metricService;
    private myGauge1;
    private myGauge2;
    private httpReq;
    constructor(registry: Registry, metricService: MetricsService);
    getMetrics(): Promise<string>;
}
