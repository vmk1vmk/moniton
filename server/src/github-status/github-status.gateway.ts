import { GithubStatusService, GithubStatus } from './github-status.service';
import { SOCKET_IO_PORT } from '../environment';
import { Socket, Server } from 'socket.io';
import {
    WebSocketGateway,
    OnGatewayInit,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Inject, Logger } from '@nestjs/common';

export const NAMESPACE = 'github-status';

export const EVENTS = {
    GET_METRICS: 'get-metrics',
    METRICS_CHANGED: 'metrics-changed',
};

@WebSocketGateway(SOCKET_IO_PORT, { namespace: NAMESPACE })
export class GithubStatusGateway implements OnGatewayInit<Server> {
    private readonly logger: Logger = new Logger(GithubStatusGateway.name);

    @Inject()
    private readonly githubStatusService: GithubStatusService;

    afterInit(server: Server) {
        const { githubStatusService } = this;

        githubStatusService.stream.subscribe((status: GithubStatus) => {
            server.emit(EVENTS.METRICS_CHANGED, status);
        });

        githubStatusService.startPolling();
    }

    @SubscribeMessage(EVENTS.GET_METRICS)
    onGetMetrics(client: Socket) {
        const { logger, githubStatusService } = this;

        logger.log(`[${EVENTS.GET_METRICS}] `);
        client.emit(EVENTS.METRICS_CHANGED, githubStatusService.value);
    }
}
