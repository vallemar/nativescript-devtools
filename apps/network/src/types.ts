export interface CDP<T> {
    method: string,
    result: T,
    params: T
}
export interface RequestWillBeSent {
    requestId: string
    frameId: string
    loaderId: string
    documentURL: string
    request: {
        url: string
        method: string
    }
    timestamp: number
    initiator: {
        type: string
    }
}

export interface ResponseReceived {
    requestId: string
    frameId: string
    loaderId: string
    timestamp: number
    type: string
    response: {
        url: string
        status: number
        statusText: string
        headers: Object
        mimeType: string
        fromDiskCache: boolean
    }
}

export interface LoadingFinished {
    requestId: string
    timestamp: number
}

export interface GetResponseBodyRequest {
    requestId: string
}
export interface GetResponseBodyRespond {
    body: string
    base64Encoded: boolean
}