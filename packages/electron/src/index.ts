import { execa } from 'execa';
import electron from 'electron';
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { exec } from 'node:child_process';
import { runViteAndExtracPort } from "@nativescript-community/devtools-shared"
const __dirname = dirname(fileURLToPath(import.meta.url));


/* var viteProcess = exec("cd " + path.join(__dirname, "../../../apps/network") + " && BACKEND_PORT=" + port + " npm run dev");
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
}); */


export async function runElectronApp(portBackend: number) {
    if (process.env.NODE_ENV !== "production") {
        runViteAndExtracPort("cd " + path.join(__dirname, "../../ui") + " && BACKEND_DEVTOOL_PORT=" + portBackend + " npm run dev").then(port => {
            process.env.FRONTEND_DEVTOOL_PORT = port;
            execa(electron as unknown as string, [__dirname + "/../dist/electron.js"], {
                stdio: 'ignore',
                windowsHide: false,
            }).then(result => {
                process.exit(result.exitCode);

            });
        })
        /*  var viteProcess = exec("cd " + path.join(__dirname, "../../ui") + " && BACKEND_PORT=" + portBackend + " npm run dev");
         viteProcess.stdout?.on('data', function (stdout: any) {
             if (stdout.includes("Local")) {
                 const rx = /(?<=localhost:)(.*)(?=\/)/gm
                 const arr = rx.exec(stdout.toString());
                 if (arr) {
                     const port = arr[1].replace(
                         /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
                     process.env.DEVTOOL_PORT = port;
                     execa(electron as unknown as string, [__dirname + "/../dist/electron.js"], {
                         stdio: 'ignore',
                         windowsHide: false,
                     }).then(result => {
                         process.exit(result.exitCode);
 
                     });
                 }
             }
         }); */
    } else {
        execa(electron as unknown as string, [__dirname + "/electron.js"], {
            stdio: 'ignore',
            windowsHide: false,
        }).then(result => {
            process.exit(result.exitCode);

        });
    }


}


