import { execa } from 'execa';
import electron from 'electron';
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { exec } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runApp() {
    if (process.env.NODE_ENV !== "production") {
        var viteProcess = exec("cd " + path.join(__dirname, "../../ui") + " && npm run dev");
        viteProcess.stdout?.on('data', function (stdout: any) {
            if (stdout.includes("ready in")) {
                execa(electron as unknown as string, [__dirname + "/../dist/electron.js"], {
                    stdio: 'ignore',
                    windowsHide: false,
                }).then(result => {
                    process.exit(result.exitCode);
                });
            }
        });
    } else {
        execa(electron as unknown as string, [__dirname + "/electron.js"], {
            stdio: 'ignore',
            windowsHide: false,
        }).then(result => {
            process.exit(result.exitCode);
        });
    }
}
