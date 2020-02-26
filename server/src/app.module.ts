import { GithubStatusModule } from './github-status';
import { Module } from '@nestjs/common';
import { GoogleAnalyticsModule } from './google-analytics/google-analytics.module';

@Module({
    imports: [GithubStatusModule, GoogleAnalyticsModule],
    providers: [],
})
export class AppModule {}
