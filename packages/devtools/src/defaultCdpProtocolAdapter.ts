import { connect, send, onMessage } from '../../cdp/src/connection'


export function runCDP(onMessageCallback: (data: any) => void) {
    connect();
    onMessage(onMessageCallback);
    function disconnect() {

    }
    return {
        disconnect
    }
}
