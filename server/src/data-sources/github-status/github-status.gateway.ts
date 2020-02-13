import { GithubStatusService, GithubStatus } from './github-status.service';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { WebSocketGateway, OnGatewayInit } from '@nestjs/websockets';

@WebSocketGateway()
export class GithubStatusGateway implements OnGatewayInit {
    private readonly eventId: string = 'github';
    private readonly logger: Logger = new Logger(GithubStatusGateway.name);

    constructor(private readonly githubService: GithubStatusService) {}

    afterInit(webSocketServer: Server) {
        const { eventId, githubService, logger } = this;

        githubService.stream.subscribe((status: GithubStatus) => {
            logger.debug(status);
            webSocketServer.emit(eventId, status);
        });

        githubService.startPolling();
    }
}
