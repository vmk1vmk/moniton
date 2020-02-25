export interface Environment {
    SOCKET_IO_PORT: number;
    HTTP_PORT: number;
}

const DEFAULT_ENVIRONMENT: Environment = {
    SOCKET_IO_PORT: 9000,
    HTTP_PORT: 3000,
};

export const SOCKET_IO_PORT: number =
    Number.parseInt(process.env.SOCKET_IO_PORT) ||
    DEFAULT_ENVIRONMENT.SOCKET_IO_PORT;

export const HTTP_PORT: number =
    Number.parseInt(process.env.HTTP_PORT) || DEFAULT_ENVIRONMENT.HTTP_PORT;
