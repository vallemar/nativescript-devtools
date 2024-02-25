import { runElectronApp } from '@nativescript-community/devtools-electron'
import fs from 'node:fs'
import path from 'node:path'
import { Server } from "socket.io";
import { createServer } from 'node:http'
import { App, createApp, eventHandler, toNodeListener, createRouter, defineEventHandler } from "h3";
import express, { Express } from 'express';
import { dirname, join } from 'node:path';
import dotenv from 'dotenv'
import { DefaultCdpAdapter } from "@nativescript-community/devtools-cdp"
import { DevToolsTabView, CdpAdapter, runViteAndExtracPort } from "@nativescript-community/devtools-shared"
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import tcpPortUsed from "tcp-port-used"
import open from 'open';
import { NS_DEVTOOLS_WEB_URL } from '.';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dotenvFile = process.env.NODE_ENV === "production" ? ".production" : ""
dotenv.config({ path: `.env${dotenvFile}` })
let io: Server | undefined;
let app: Express | undefined;

async function findFreePort(port: number) {
    const inUse = await tcpPortUsed.check(port, '127.0.0.1');
    if (inUse) {
        return findFreePort(port + 1);
    }
    return port;
}
const tabViews = [];
const backendDevToolPort = await findFreePort((process.env.PORT ? parseInt(process.env.PORT) : 3000));

export function runDevTools(options?: { cdpAdapter?: CdpAdapter, portCdp?: number, runInWepApp?: boolean, runInBackground?: boolean }) {
    return new Promise<void>(resolve => {
        app = express();
        const cdpAdapter = options?.cdpAdapter ?? new DefaultCdpAdapter();

        const serverExpress = createServer(app);
        app.get('/', (req, res) => {
            res.send('<h1>Hello world</h1>');
        });

        io = new Server(serverExpress, {
            cors: {
                origin: true,
            },
        })

        io.on("connection", (socket) => {
            console.log("on Connected");
            socket.on("main-tool", () => {
                addBaseTabView();
            })

            socket.on("cdp", (data) => {
                // Send msg to cdp
                cdpAdapter.send(data);
            })
            // Send full msg when new clien connect
            cdpAdapter.fullMsg.forEach(cdpMsg => socket.emit("cdp", cdpMsg));
        });

        serverExpress.listen(backendDevToolPort, async () => {
            console.log(`listening on 0.0.0.0:${backendDevToolPort}`)

            cdpAdapter.setServerSocketIo(io!);
            cdpAdapter.onClose = () => {
                io?.emit("cdp-close")
                cdpAdapter.initBus();
            };
            cdpAdapter.onError = () => {
                io?.emit("cdp-error")
            };
            cdpAdapter.onConnect = () => {
                io?.emit("cdp-connected")
            };
            if (!options?.cdpAdapter) {
                cdpAdapter.initBus();
            }

            if (options?.runInBackground) {
                runViteAndExtracPort("cd " + path.join(__dirname, "../../ui") + " && BACKEND_DEVTOOL_PORT=" + backendDevToolPort + " npm run dev").then(async (port: string) => {
                    resolve();
                })
            } else if (options?.runInWepApp) {
                runViteAndExtracPort("cd " + path.join(__dirname, "../../ui") + " && BACKEND_DEVTOOL_PORT=" + backendDevToolPort + " npm run dev").then(async (port: string) => {
                    await open(`http://localhost:${port}/?BACKEND_DEVTOOL_PORT=${backendDevToolPort}`);
                    resolve();
                })
            } else {
                runElectronApp(backendDevToolPort)
                resolve();
            }
        });
    })
}

export function addTapView(plugin: DevToolsTabView) {
    const url = `/plugin/${plugin.id}`;

    if (!plugin.src.includes("http")) {
        plugin.iframe = `http://localhost:${port}${url}`
    } else {
        plugin.iframe = plugin.src;
    }
    const tapViewPublicResource = plugin.src.replace("/" + plugin.src.split("/")[plugin.src.split("/").length - 1], `/${plugin.id}`);
    app?.use(`/${plugin.id}`, express.static(tapViewPublicResource))
    app?.get(url, (req, res) => {
        res.sendFile(plugin.src)
        //res.sendFile('views/test.html', {root: __dirname })
    });
    io?.emit("add-plugin", plugin);
    tabViews.push(plugin);
}

function addBaseTabView() {
    //addTapView({ id: "network", name: "Network", src: `/Users/vallemar/workspaces/test/testCDP/apps/network/dist/index.html`, icon: "cloud_sync" })

    runViteAndExtracPort("cd " + path.join(__dirname, "../../../apps/network") + " && BACKEND_DEVTOOL_PORT=" + backendDevToolPort + " npm run dev").then((port: string) => {
        addTapView({ id: "network", name: "Network", src: `http://localhost:${port}`, icon: "cloud_sync" })
    })
}


