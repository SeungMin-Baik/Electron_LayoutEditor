// Socket
import * as io from 'socket.io-client';

// Config
import electronConfig from '@app/config/electron-config';

// Function
import { MD5 } from '@app/utils/renderer/others/MD5';

let socket: SocketIOClient.Socket = null;

/**
 * Connect to socket server.
 * @param socketServer  Socket server.
 */
export function init(): Promise<SocketIOClient.Socket> {
    const sToken = Date.now() + '.' + MD5(Date.now() + electronConfig.SOCKET_IO_AUTO_KEY);

    // Connect socket connection.
    return new Promise<SocketIOClient.Socket>(resolve => {
        socket = io(electronConfig.ROOT_SOCKET_URL, {
            transports: ['websocket'],
            secure: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 5000,
            reconnectionDelayMax: 15000,
            randomizationFactor: 0.5,
            autoConnect: true,
            timeout: 10000,
            query: 'token=' + btoa(sToken)
        });

        console.groupCollapsed('%c📡[API-WebSocket] Initialized', 'color: #28a745');
        console.info('%cSocket connection has been initialized', 'color: blue; font-size: 1.4em;');
        console.dir(socket);
        console.groupEnd();

        resolve(socket);
    });
}


/**
 * Disconnect socket connection.
 */
export function disconnect() {
    socket.disconnect();
}


/**
 * Once disconnected from socket server.
 */
export function onceDisconnect(): Promise<SocketIOClient.Socket> {
    return new Promise<SocketIOClient.Socket>(resolve => {
        socket.once('disconnect', () => {
            console.info('%c📡[API-WebSocket] Disconnceted', 'color: #dc3545');
            resolve(socket);
        });
    });
}


/**
 * Once reconnected to socket server.
 */
export function onceReconnect(): Promise<SocketIOClient.Socket> {
    return new Promise<SocketIOClient.Socket>(resolve => {
        socket.once('reconnect', () => {
            console.info('%c📡[API-WebSocket] Reconnceted', 'color: #28a745');
            resolve(socket);
        });
    });
}
