import { execa } from 'execa';
import electron from 'electron';
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { exec } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

/* const appPath = decodeURIComponent(resolve(new URL('../dist/app.cjs', import.meta.url).pathname))
const argv = process.argv.slice(2) */
export async function runApp() {
    if (process.env.NODE_ENV !== "production") {

        exec("cd " + path.join(__dirname, "../../ui") + " && npm run dev")
        setTimeout(() => {
            execa(electron as unknown as string, [__dirname + "/electron.js"], {
                stdio: 'ignore',
                windowsHide: false,
            }).then(result => {
                process.exit(result.exitCode);
            });
        }, 1000);
    } else {
        execa(electron as unknown as string, [__dirname + "/electron.js"], {
            stdio: 'ignore',
            windowsHide: false,
        }).then(result => {
            process.exit(result.exitCode);
        });
    }

}
