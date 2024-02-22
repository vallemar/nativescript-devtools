export * from "./types"


import { Server } from "socket.io";

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