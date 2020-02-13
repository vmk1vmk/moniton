import { AxiosResponse } from 'axios';
import { HttpService, HttpModule } from '@nestjs/common';
import { PollingService, PollingConfig } from './polling.service';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { TestScheduler } from 'rxjs/testing';
import { TestingModule, Test } from '@nestjs/testing';
import { of, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

const ENDPOINT_URL = 'https://www.fake.endpoint.com/api';
const INTERVAL_MS = 500;

const POLLING_CONFIG: PollingConfig = {
    endpoint: ENDPOINT_URL,
    interval: INTERVAL_MS,
};

const MARBLE_TEST_DATA = { a: 'a', b: 'b', c: 'c' };

describe('PollingService', () => {
    let testingModule: TestingModule;
    let httpService: HttpService;
    let pollingService: PollingService;
    let testScheduler: TestScheduler;

    beforeEach(async () => {
        testingModule = await Test.createTestingModule({
            imports: [HttpModule],
            providers: [PollingService],
        }).compile();

        httpService = testingModule.get<HttpService>(HttpService);
        pollingService = testingModule.get<PollingService>(PollingService);

        testScheduler = new TestScheduler((actual, expected) =>
            expect(actual).toEqual(expected),
        );
    });

    afterEach(async () => {
        testScheduler.flush(); // 🚽
        jest.resetAllMocks();
        await testingModule.close();
    });

    it('should request data from the correct url and return the response', () => {
        const { a } = MARBLE_TEST_DATA;

        const getSpy: jest.SpyInstance = mockHttpServiceGetResponses(a);
        const expected = '(a|)';

        testScheduler.run(({ expectObservable }: RunHelpers) =>
            expectObservable(
                pollingService.poll(POLLING_CONFIG).pipe(take(1)),
            ).toBe(expected, MARBLE_TEST_DATA),
        );

        expect(getSpy).toHaveBeenCalledWith(ENDPOINT_URL);
    });

    it('should request data with the specified timeout interval', () => {
        const { a, b, c } = MARBLE_TEST_DATA;

        mockHttpServiceGetResponses(a, b, c);
        const expected = 'a 499ms b 499ms (c|)';

        testScheduler.run(({ expectObservable }: RunHelpers) =>
            expectObservable(
                pollingService.poll(POLLING_CONFIG).pipe(take(3)),
            ).toBe(expected, MARBLE_TEST_DATA),
        );
    });

    it('should not emit the same response twice', () => {
        const { a, b, c } = MARBLE_TEST_DATA;

        mockHttpServiceGetResponses(a, b, b, c);
        const expected = 'a 499ms b 499ms - 499ms (c|)';

        testScheduler.run(({ expectObservable }: RunHelpers) =>
            expectObservable(
                pollingService.poll(POLLING_CONFIG).pipe(take(3)),
            ).toBe(expected, MARBLE_TEST_DATA),
        );
    });

    function mockHttpServiceGetResponses<T>(
        ...responses: T[]
    ): jest.SpyInstance {
        const getSpy: jest.SpyInstance = jest.spyOn(httpService, 'get');

        responses.forEach(response =>
            getSpy.mockReturnValueOnce(toAxiosResponse(response)),
        );

        return getSpy;
    }

    function toAxiosResponse<ResponseType>(
        response: ResponseType,
    ): Observable<AxiosResponse<ResponseType>> {
        return of({
            data: response,
        } as AxiosResponse<ResponseType>);
    }
});
