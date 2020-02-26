import { GithubStatusService, GithubStatus } from './github-status.service';
import { SOCKET_IO_PORT } from '../environment';
import { Socket, Server } from 'socket.io';
import {
    WebSocketGateway,
    OnGatewayInit,
    SubscribeMessage,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';

export const NAMESPACE = 'github-status';

export const EVENTS = {
    GET_METRICS: 'get-metrics',
    METRICS_CHANGED: 'metrics-changed',
};

@WebSocketGateway(SOCKET_IO_PORT, { namespace: NAMESPACE })
export class GithubStatusGateway implements OnGatewayInit<Server> {
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
    onGetMetrics(@ConnectedSocket() client: Socket) {
        client.emit(EVENTS.METRICS_CHANGED, this.githubStatusService.value);
    }
}
