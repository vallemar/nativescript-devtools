import path, { dirname } from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import { BrowserWindow, app } from 'electron'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: "../icons/128_mac.icns",
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
            // @TODO: enabled in dev mode
            devTools: true,
        },
    })

    mainWindow.setMenu(null)

    const appEntryPath = path.join(__dirname, '../../ui/index.html')
    const url = process.env.NODE_ENV === "production" ? new URL(`file://${appEntryPath}`).toString() : "http://localhost:5173/";
    mainWindow.loadURL(new URL(url).toString())

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit()
})

app.on('activate', () => {
    if (mainWindow === null)
        createWindow()
})