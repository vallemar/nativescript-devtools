export * from "./types"


import { exec } from "child_process";
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

export function runViteAndExtracPort(command: string) {
    return new Promise(resolve => {
        var viteProcess = exec(command);
        viteProcess.stdout?.on('data', function (stdout: any) {
            if (stdout.includes("Local")) {
                const rx = /(?<=localhost:)(.*)(?=\/)/gm
                const arr = rx.exec(stdout.toString());
                if (arr) {
                    const port = arr[1].replace(
                        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
                    resolve(port);
                }
            }
        });

    })
}