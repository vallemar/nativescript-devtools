# NativeScript-Devtools

⚠️ Work in progress. This project will be moved to [@nativescript-community](https://github.com/nativescript-community).

This tool is inspired by the new [vue devtools-next](https://devtools-next.vuejs.org/guide/features) but focused on [NativeScript](https://nativescript.org/).

## Packages
- `cdp`. It is the package in charge of connecting to the websocket that builds the nativescript cli to be able to debug through the Google CDP standard and send events between NS and this devtools.
- `devtools`. It is the core of this application. It listens for `cdp` events to transmit them to the front and also raises a socket between the front and this application to send events and notify new states.
- `electron`. Package that builds the electron application locally, using the UI module.
- `ui`. An application in Vue3 that can be built on electron, a web tab in the browser or in vscode along with the extension [nativescript-vscode-extension](https://github.com/nativescript-community/nativescript-vscode-extension).


## Collaborate.

1. Create a fork and clone the repository to your PC/MAC
2. `npm i`
3. `npm run dev`


This will open an electron screen with the application hosted under the [ui](https://github.com/vallemar/nativescript-devtools/tree/main/packages/ui) package.