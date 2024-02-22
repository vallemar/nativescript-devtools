<script setup lang="ts">
import { io } from "socket.io-client";
import { ref } from "vue";
import { CDP, RequestWillBeSent, ResponseReceived, GetResponseBodyRequest, GetResponseBodyRespond, LoadingFinished } from "./types"
const socket = io("http://localhost:3000");
const data = ref<Map<string, { requestWillBeSent: RequestWillBeSent, responseReceived?: ResponseReceived, finish?: LoadingFinished, body?: CDP<GetResponseBodyRespond>, open?: boolean }>>(new Map())
let lastRequestId = "0";
socket.on("cdp", (message: any) => {
  if (message.method == "Network.requestWillBeSent") {
    const dataCDP = message as CDP<RequestWillBeSent>;
    data.value.set(dataCDP.params.requestId, { requestWillBeSent: dataCDP.params })
  }

  if (message.method === "Network.responseReceived") {
    const dataCDP = message as CDP<ResponseReceived>;
    const request = data.value.get(dataCDP.params.requestId)
    if (request) {
      request.responseReceived = dataCDP.params;
      data.value.set(dataCDP.params.requestId, request)
    }


  }

  if (message.method === "Network.loadingFinished") {
    const dataCDP = message as CDP<LoadingFinished>;
    lastRequestId = dataCDP.params.requestId
    socket.emit("cdp", { method: "Network.getResponseBody", params: { requestId: dataCDP.params.requestId } as GetResponseBodyRequest });
    const request = data.value.get(dataCDP.params.requestId)
    if (request) {
      request.finish = dataCDP.params;
      data.value.set(dataCDP.params.requestId, request)
    }
  }

  if (message.result && message.result.body) {
    const dataCDP = message as CDP<GetResponseBodyRespond>;
    const request = data.value.get(lastRequestId)
    if (request) {
      request.body = dataCDP;
      data.value.set(lastRequestId, request)
    }
  }
});

function open(requestId: string) {
  const request = data.value.get(requestId)!;
  request.open = !request?.open;
}
</script>

<template>
  <div class="w-full h-full text-left pl-4 block">
    <div class="header py-2">
      <div class="col">Name</div>
      <div class="col">Method</div>
      <div class="col">Status</div>
    </div>
    <div v-for="(request, i) in data.keys()" :key="i" class="w-full cursor-pointer row py-1" @click="open(request)">
      <div class="text-left col">{{ data.get(request)?.requestWillBeSent?.request.url }}</div>
      <div class="col"> {{ data.get(request)?.requestWillBeSent?.request.method }}</div>
      <div class="col">{{ data.get(request)?.responseReceived?.response.status }}</div>
      <div class="details w-full overflow-x-auto p-4" v-if="data.get(request)?.open"
        @click="($event) => $event.stopPropagation()">
        <div class="text-xl font-bold">Response</div>
        <span>{{ data.get(request)?.body?.result?.body }}
        </span>
      </div>
    </div>
    <div v-if="data.size === 0" class="mt-4 text-center">No request captured</div>
  </div>
</template>
<style scoped>
.row:nth-child(even) {
  background-color: #182235;
}

.header,
.row {
  display: flex;
  flex-wrap: wrap;
}

.col {
  flex: 1;
  padding: 2px 8px;
}
</style>

