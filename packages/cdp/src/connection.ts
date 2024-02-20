import { ErrorEvent, WebSocket } from "ws";

type CallbackMessage = (data: any) => void;

let webSocket: WebSocket | null = null;
const onMessageCallbacks: CallbackMessage[] = []
export function connect() {
    webSocket = new WebSocket("ws://localhost:41000")

    webSocket.on('error', console.error);

    webSocket.on('open', function open() {
        send({
            id: 1,
            method: "Runtime.enable",
            params: {
                discover: true
            }
        });
    });

    webSocket.on('message', function message(data) {
        console.log('received: %s', data);
        const dataReceived = JSON.parse((data as Buffer).toString("utf-8"));
        if (dataReceived.method)
            onMessageCallbacks.forEach(callback => callback({ method: dataReceived.method, params: dataReceived.params }))
    });

    return webSocket;
}

export function send(data: any) {
    webSocket?.send(JSON.stringify(data));
}

export function onMessage(callback: CallbackMessage) {
    onMessageCallbacks.push(callback)
}