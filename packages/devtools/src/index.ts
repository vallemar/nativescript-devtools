import { runApp } from '../../electron/dist/index'
import fs from 'node:fs'
import path from 'node:path'
import { Server } from "socket.io";
import { createServer } from 'node:http'
import { createApp, eventHandler, toNodeListener } from "h3";
import express from 'express';
import { dirname, join } from 'node:path';
import { runCDP } from './defaultCdpProtocolAdapter';
import dotenv from 'dotenv'

const dotenvFile = process.env.NODE_ENV === "production" ? ".production" : ""
dotenv.config({ path: `.env${dotenvFile}` })

const port = (process.env.PORT || 3000) as number
const app = createApp()
app.use(
    '/',
    eventHandler(() => {
        return ""
    }),
)

const httpServer = createServer(toNodeListener(app))
const io = new Server(httpServer, {
    cors: {
        origin: false,
    },
})

io.on("connection", (socket) => {
    console.log("on Connected");

});

httpServer.listen(port, () => {
    console.log(`listening on 0.0.0.0:${port}`)
    setTimeout(() => {
        runCDP((data) => {
            io.emit("cdp", data)
        })
        runApp()
    }, 1000);
});


