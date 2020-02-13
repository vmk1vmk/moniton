import { Module, Logger } from '@nestjs/common';

import { GithubStatusGateway } from './github-status.gateway';
import { GithubStatusService } from './github-status.service';
import { PollingModule } from 'src/polling/polling.module';

@Module({
    imports: [PollingModule],
    providers: [Logger, GithubStatusService, GithubStatusGateway],
})
export class GithubStatusModule {}
