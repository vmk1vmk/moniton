import { Injectable } from '@nestjs/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PollingService } from '../../polling';
import { pluck } from 'rxjs/operators';

type Observable<Data> = import('rxjs').Observable<Data>;

export interface GithubStatusApiResponse {
    page: {
        id: string;
        name: string;
        url: string;
        time_zone: string;
        updated_at: string;
    };
    status: {
        description: string;
        indicator: GithubStatusIndicator;
    };
}

export interface GithubStatus {
    description: string;
    indicator: GithubStatusIndicator;
}

export type GithubStatusIndicator = 'none' | 'minor' | 'major' | 'critical';

const GITHUB_STATUS_ENDPOINT =
    'https://kctbh9vrtdwd.statuspage.io/api/v2/status.json';

const RATE_LIMIT_PER_HOUR = 5000;
const POLL_TIMEOUT_MS: number = (60 * 60 * 1000) / RATE_LIMIT_PER_HOUR;

@Injectable()
export class GithubStatusService {
    private readonly metrics: BehaviorSubject<GithubStatus>;

    private subscription: Subscription;

    constructor(private readonly pollingService: PollingService) {
        this.metrics = new BehaviorSubject<GithubStatus>({
            indicator: 'none',
            description: '',
        });
    }

    startPolling() {
        const { pollingService, metrics } = this;

        if (!this.subscription) {
            this.subscription = pollingService
                .poll<GithubStatusApiResponse>({
                    endpoint: GITHUB_STATUS_ENDPOINT,
                    interval: POLL_TIMEOUT_MS,
                })
                .pipe(pluck('status'))
                .subscribe(metrics);
        }
    }

    stopPolling() {
        this.subscription.unsubscribe();
    }

    get value(): GithubStatus {
        return this.metrics.getValue();
    }

    get stream(): Observable<GithubStatus> {
        return this.metrics.asObservable();
    }
}
