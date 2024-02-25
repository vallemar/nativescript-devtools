import { WebSocket } from "ws";
import { CdpAdapter } from "@nativescript-community/devtools-shared"
import type DevToolsProtocol from 'devtools-protocol'
import * as rpc from 'noice-json-rpc'

export class DefaultCdpAdapter extends CdpAdapter {

    webSocket: WebSocket | null = null;
    onClose!: () => void | undefined;
    onError!: () => void | undefined;
    onConnect!: () => void | undefined;

    async initBus() {
        /*    const rpcClient = new rpc.Client(new WebSocket('ws://localhost:8080'), { logConsole: true })
           const api: DevToolsProtocol = rpcClient.api()
   
           await Promise.all([
               api.Runtime.enable(),
               api.Profiler.enable(),
           ])
   
           await api.Runtime.run()
           await api.Profiler.start()
   
           await new Promise(resolve => api.Runtime.on('executionContextDestroyed', resolve)); // Wait for event
           const result = await api.Profiler.stop() */

        //console.log('Result', result)

        this.webSocket = new WebSocket("ws://localhost:41000");

        this.webSocket?.on('open', () => {
            console.log("[CDP] open")
            this.onConnect();
            this.send({
                id: 1,
                method: "Runtime.enable",
                params: {
                    discover: true
                }
            });
        });
        this.webSocket?.on('close', () => {
            console.log("[CDP] close")
            if (this.onClose)
                this.onClose()
        });

        this.webSocket?.on('error', () => {
            console.log("[CDP] error")
            this.onError();
        });


        this.webSocket?.on('message', (data) => {
            const dataReceived = JSON.parse((data as Buffer).toString("utf-8"));
            this.onMessage({ method: dataReceived.method, result: dataReceived.result, params: dataReceived.params })
        });
    }

    send(data: any) {
        this.webSocket?.send(JSON.stringify(data));
    }
}
