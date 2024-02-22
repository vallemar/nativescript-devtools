import { runApp } from '@nativescript-community/devtools-electron'
import fs from 'node:fs'
import path from 'node:path'
import { Server } from "socket.io";
import { createServer } from 'node:http'
import { App, createApp, eventHandler, toNodeListener, createRouter, defineEventHandler } from "h3";
import express, { Express } from 'express';
import { dirname, join } from 'node:path';
import dotenv from 'dotenv'
import { DefaultCdpAdapter } from "@nativescript-community/devtools-cdp"
import { DevToolsTabView, CdpAdapter } from "@nativescript-community/devtools-shared"
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dotenvFile = process.env.NODE_ENV === "production" ? ".production" : ""
dotenv.config({ path: `.env${dotenvFile}` })
let io: Server | undefined;
let app: Express | undefined;
const port = (process.env.PORT || 3000) as number

export function runDevTools(options?: { cdpAdapter?: CdpAdapter }) {
    return new Promise<void>(resolve => {
        app = express();
        const cdpAdapter = new DefaultCdpAdapter();

        const serverExpress = createServer(app);
        app.get('/', (req, res) => {
            res.send('<h1>Hello world</h1>');
        });

        io = new Server(serverExpress, {
            cors: {
                origin: false,
            },
        })

        io.on("connection", (socket) => {
            console.log("on Connected");
            socket.on("main-tool", () => {
                addBaseTabView();
            })

            socket.on("cdp", (data) => {
                console.log("on CDP");
                console.log(data);

                if (options?.cdpAdapter) {
                    options?.cdpAdapter.send(data);
                } else {
                    cdpAdapter.send(data);
                }
            })
        });

        serverExpress.listen(port, () => {
            console.log(`listening on 0.0.0.0:${port}`)
            if (options?.cdpAdapter) {
                options?.cdpAdapter.setServerSocketIo(io!);
            } else {
                cdpAdapter.onClose = () => {
                    cdpAdapter.initBus();
                };
                cdpAdapter.setServerSocketIo(io!);
                cdpAdapter.initBus();
            }
            runApp()
            resolve();
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
    io?.emit("add-plugin", plugin)
}

function addBaseTabView() {
    //addTapView({ id: "network", name: "Network", src: `/Users/vallemar/workspaces/test/testCDP/apps/network/dist/index.html`, icon: "cloud_sync" })

    var viteProcess = exec("cd " + path.join(__dirname, "../../../apps/network") + " && npm run dev");
    viteProcess.stdout?.on('data', function (stdout) {
        if (stdout.includes("Local")) {
            const rx = /(?<=localhost:)(.*)(?=\/)/gm
            const arr = rx.exec(stdout.toString());
            if (arr) {
                const port = arr[1].replace(
                    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
                addTapView({ id: "network", name: "Network", src: `http://localhost:${port}`, icon: "cloud_sync" })
            }
        }
    });
}


