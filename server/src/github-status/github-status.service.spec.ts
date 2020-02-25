import { Test, TestingModule } from '@nestjs/testing';
import { PollingService, PollingConfig } from '../polling/polling.service';
import {
    GithubStatusService,
    GithubStatus,
    GithubStatusApiResponse,
} from './github-status.service';
import { of, Subject } from 'rxjs';
import { PollingModule } from '../polling';

const EMPTY_GITHUB_STATUS: GithubStatus = {
    indicator: 'none',
    description: '',
};

/* eslint-disable @typescript-eslint/camelcase */
const GITHUB_STATUS_API_RESPONSE: GithubStatusApiResponse = {
    page: {
        id: 'kctbh9vrtdwd',
        name: 'GitHub',
        url: 'https://www.githubstatus.com',
        time_zone: 'Etc/UTC',
        updated_at: '2020-01-01T00:00:00+00:00',
    },
    status: {
        indicator: 'none',
        description: 'All Systems Operational',
    },
};
/* eslint-enable @typescript-eslint/camelcase */

const OTHER_GITHUB_STATUS_API_RESPONSE: GithubStatusApiResponse = {
    ...GITHUB_STATUS_API_RESPONSE,
    status: {
        indicator: 'critical',
        description: 'System is nuked',
    },
};

const RATE_LIMIT_TIMEOUT_MS = 720;

describe('GithubStatus Service', () => {
    let testingModule: TestingModule;
    let pollingService: PollingService;
    let githubStatusService: GithubStatusService;

    beforeEach(async () => {
        testingModule = await Test.createTestingModule({
            imports: [PollingModule],
            providers: [GithubStatusService],
        }).compile();

        pollingService = testingModule.get<PollingService>(PollingService);
        githubStatusService = testingModule.get<GithubStatusService>(
            GithubStatusService,
        );
    });

    afterEach(async () => {
        await testingModule.close();
        jest.resetAllMocks();
    });

    it('should start with an empty github status', () => {
        githubStatusService.stream.subscribe((status: GithubStatus) => {
            expect(status).toEqual(EMPTY_GITHUB_STATUS);
        });
    });

    it('should be able to poll data from the data source', () => {
        const pollSubject: Subject<GithubStatusApiResponse> = new Subject();
        jest.spyOn(pollingService, 'poll').mockReturnValue(pollSubject);
        githubStatusService.startPolling();

        pollSubject.next(GITHUB_STATUS_API_RESPONSE);

        expect(githubStatusService.value).toEqual(
            GITHUB_STATUS_API_RESPONSE.status,
        );
    });

    it('should start polling from the correct url', (done: jest.DoneCallback) => {
        jest.spyOn(pollingService, 'poll').mockImplementation(
            ({ endpoint }: PollingConfig) => {
                expect(endpoint).toEqual(
                    'https://kctbh9vrtdwd.statuspage.io/api/v2/status.json',
                );
                done();
                return of(EMPTY_GITHUB_STATUS);
            },
        );

        githubStatusService.startPolling();
    });

    it('should poll with the timeout to stay inside the rate limit', (done: jest.DoneCallback) => {
        jest.spyOn(pollingService, 'poll').mockImplementation(
            ({ interval }: PollingConfig) => {
                expect(interval).toEqual(RATE_LIMIT_TIMEOUT_MS);
                done();
                return of(EMPTY_GITHUB_STATUS);
            },
        );

        githubStatusService.startPolling();
    });

    it('should be able to stop a started polling process', () => {
        const pollSubject: Subject<GithubStatusApiResponse> = new Subject();
        jest.spyOn(pollingService, 'poll').mockReturnValue(pollSubject);
        githubStatusService.startPolling();

        pollSubject.next(GITHUB_STATUS_API_RESPONSE);

        githubStatusService.stopPolling();

        pollSubject.next(OTHER_GITHUB_STATUS_API_RESPONSE);

        expect(githubStatusService.value).toEqual(
            GITHUB_STATUS_API_RESPONSE.status,
        );
    });

    it('should not start polling twice in a row', () => {
        const pollSpy: jest.SpyInstance = jest
            .spyOn(pollingService, 'poll')
            .mockReturnValue(of(GITHUB_STATUS_API_RESPONSE));

        githubStatusService.startPolling();
        githubStatusService.startPolling();

        expect(pollSpy).toHaveBeenCalledTimes(1);
    });
});
