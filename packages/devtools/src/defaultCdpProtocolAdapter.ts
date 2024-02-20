import { DefaultCdpAdapter } from '../../cdp/src/connection'


export function runCDP(onMessageCallback: (data: any) => void) {
    const cdpAdapter = new DefaultCdpAdapter();
    cdpAdapter.addOnMessage(onMessageCallback)
    cdpAdapter.initBus();

    return {
        cdpAdapter
    }
}