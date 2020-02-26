import React, { Context, FunctionComponent, useState, ReactElement } from "react";
import { GithubStatus, GithubStatusContext } from ".";
import socketIOClient from "socket.io-client";

const { Provider, Consumer }: Context<GithubStatusContext> = React.createContext<GithubStatusContext>({
    isLoading: true,
    hasErrors: false,
});

interface Props {
    children: ReactElement;
}

const socket: SocketIOClient.Socket = socketIOClient('http://localhost:9000/github-status')

const GithubContextProvider: FunctionComponent<Props> = (props: Props): JSX.Element => {
    const [context, setContext] = useState<GithubStatusContext>(() => {
        socket.emit('get-metrics')

        return {
            isLoading: true,
            hasErrors: false
        };
    });

    socket.on('metrics-changed', (status: GithubStatus) =>
        setContext({
            isLoading: false,
            hasErrors: false,
            lastUpdated: Date.now(),
            status
        })
    );

    socket.on('connect_error', (error: Error) =>
        setContext({
            isLoading: false,
            hasErrors: true,
            error
        })
    )

    socket.on('reconnect', () => socket.emit('get-metrics'))

    return <Provider value={context}>{props.children}</Provider>;
}

export {
    GithubContextProvider,
    Consumer as GithubContextConsumer
};