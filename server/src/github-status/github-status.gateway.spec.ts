import {
    GithubStatusGateway,
    NAMESPACE,
    EVENTS,
} from './github-status.gateway';
import { GithubStatusService, GithubStatus } from './github-status.service';
import { INestApplication } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import { TestingModule, Test } from '@nestjs/testing';
import * as io from 'socket.io-client';
import { SOCKET_IO_PORT } from '../environment';

const INITIAL_GITHUB_STATUS: GithubStatus = {
    description: 'All Systems operational',
    indicator: 'none',
};

const SECOND_GITHUB_STATUS: GithubStatus = {
    description: 'Some issues have occured',
    indicator: 'minor',
};

const THIRD_GITHUB_STATUS: GithubStatus = {
    description: 'Severe outages',
    indicator: 'major',
};

describe('GithubStatus Gateway', () => {
    let dataStream: BehaviorSubject<GithubStatus>;
    let startPollingMock: jest.Mock;
    let stopPollingMock: jest.Mock;

    let testingModule: TestingModule;
    let app: INestApplication;
    let client: SocketIOClient.Socket;

    beforeEach(async () => {
        dataStream = new BehaviorSubject<GithubStatus>(INITIAL_GITHUB_STATUS);
        startPollingMock = jest.fn();
        stopPollingMock = jest.fn();

        testingModule = await Test.createTestingModule({
            providers: [GithubStatusGateway, GithubStatusService],
        })
            .overrideProvider(GithubStatusService)
            .useValue({
                startPolling: startPollingMock,
                stopPolling: stopPollingMock,
                get value() {
                    return dataStream.value;
                },
                stream: dataStream.asObservable(),
            })
            .compile();

        app = testingModule.createNestApplication();
        app.listenAsync(3000);

        client = io(`http://localhost:${SOCKET_IO_PORT}/${NAMESPACE}`);

        await waitUntilConnected(client);
    });

    afterEach(async () => {
        client.close();
        await app.close();
        await testingModule.close();
    });

    it('should start polling as soon as the gateway is initialized', () => {
        expect(startPollingMock).toHaveBeenCalledTimes(1);
    });

    it('should return the intial value to the requesting client if not events were emitted yet', (done: jest.DoneCallback) => {
        client.on(EVENTS.METRICS_CHANGED, (status: GithubStatus) => {
            expect(status).toEqual(INITIAL_GITHUB_STATUS);
            done();
        });

        client.emit(EVENTS.GET_METRICS);
    });

    it('should be able to request the latest metrics data from the ', (done: jest.DoneCallback) => {
        dataStream.next(SECOND_GITHUB_STATUS);

        client.on(EVENTS.METRICS_CHANGED, (status: GithubStatus) => {
            expect(status).toEqual(SECOND_GITHUB_STATUS);
            done();
        });

        client.emit(EVENTS.GET_METRICS);
    });

    it('should be able to request the latest metrics data from the ', (done: jest.DoneCallback) => {
        client.on(
            EVENTS.METRICS_CHANGED,
            checkParametersMock<GithubStatus>(
                [SECOND_GITHUB_STATUS, THIRD_GITHUB_STATUS],
                done,
            ),
        );

        dataStream.next(SECOND_GITHUB_STATUS);
        dataStream.next(THIRD_GITHUB_STATUS);
    });
});

function checkParametersMock<Value = any>(
    values: [Value, ...Value[]],
    done: jest.DoneCallback,
): jest.Mock {
    const mockEventCallback: jest.Mock = jest.fn();

    values
        .slice(0, -1)
        .forEach(() => mockEventCallback.mockImplementationOnce(() => {}));
    mockEventCallback.mockImplementationOnce(() => {
        expect(mockEventCallback.mock.calls).toEqual(
            values.map(value => [value]),
        );
        done();
    });

    return mockEventCallback;
}

async function waitUntilConnected(
    client: SocketIOClient.Socket,
): Promise<void> {
    return new Promise((resolve: VoidFunction) => {
        client.on('connect', () => resolve());
    });
}
