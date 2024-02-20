import { Server } from "socket.io";
import { ErrorEvent, WebSocket } from "ws";


export abstract class CdpAdapter {
    private serverSocketIo?: Server;
    abstract send(data: any): void

    // Internal use
    public setServerSocketIo(serverSocketIo: Server) {
        this.serverSocketIo = serverSocketIo;
    }

    public onMessage(data: any) {
        if (this.serverSocketIo)
            this.serverSocketIo.emit("cdp", data)
    }
}
export class DefaultCdpAdapter extends CdpAdapter {
    webSocket: WebSocket | null = null;

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
            const dataReceived = JSON.parse((data as Buffer).toString("utf-8"));
            if (dataReceived.method)
                this.onMessage({ method: dataReceived.method, params: dataReceived.params })
        });
    }

    send(data: any) {
        this.webSocket?.send(JSON.stringify(data));
    }
}
