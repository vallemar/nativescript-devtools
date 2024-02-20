import { ErrorEvent, WebSocket } from "ws";

type CallbackMessage = (data: any) => void;

export interface CdpAdapter {
    send: (data: any) => void,
    addOnMessage: (callback: CallbackMessage) => void
}

export class DefaultCdpAdapter implements CdpAdapter {
    webSocket: WebSocket | null = null;
    onMessageCallbacks: CallbackMessage[] = []

    initBus() {
        this.webSocket = new WebSocket("ws://localhost:41000");
        this.webSocket?.on('open', () => {
            this.send({
                id: 1,
                method: "Runtime.enable",
                params: {
                    discover: true
                }
            });
        });

        this.webSocket?.on('error', console.error);


        this.webSocket?.on('message', (data) => {
            console.log('received: %s', data);
            const dataReceived = JSON.parse((data as Buffer).toString("utf-8"));
            if (dataReceived.method)
                this.onMessageCallbacks.forEach(callback => callback({ method: dataReceived.method, params: dataReceived.params }))
        });
    }
    send(data: any) {
        this.webSocket?.send(JSON.stringify(data));
    }

    addOnMessage(callback: CallbackMessage) {
        this.onMessageCallbacks.push(callback)

    };

}
