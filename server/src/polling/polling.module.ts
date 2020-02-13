import { Module, HttpModule, Logger } from '@nestjs/common';
import { PollingService } from './polling.service';

@Module({
    imports: [HttpModule],
    providers: [PollingService],
    exports: [PollingService],
})
export class PollingModule {}
