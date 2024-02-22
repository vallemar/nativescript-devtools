<script setup lang="ts">
import { io } from "socket.io-client";
import { ref } from "vue"
import { DevToolsTabView } from "@nativescript-community/devtools-shared/src"
import { useTabViewStore } from "./store/tabViewStore"

const { tabViews, addTabView, showTabView } = useTabViewStore();

//@ts-ignore
const socket = io("http://localhost:3000");
console.log(socket);

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  socket.emit("main-tool")
});
socket.on("connect_error", (e) => {
  setTimeout(() => {
    // alert(e)
  }, 1000);
});
socket.on("disconnect", () => {
  console.log(socket.id);
});

socket.on("cdp", (data) => {
  console.log(data);
  /*   var iframes = document.querySelectorAll("iframe");
  
    const iframeCdpEvent = new CustomEvent('cdp', data);
  
    iframes.forEach(iframe => {
      console.log(iframe);
  
      iframe.contentWindow.postMessage("cdp", data);
    }) */
});

socket.on("add-plugin", (data: DevToolsTabView) => {
  addTabView(data)
});

function onload() {
  alert("LOADED")

}
</script>

<template>
  <div class="w-full h-full flex">
    <div class="bg-[#182235] h-full w-auto max-w-[150px]">
      <div>
        <router-link to="/" @click="showTabView(null)">
          <img src="./assets/128.png" class="w-[38px] m-3" />
        </router-link>
      </div>
      <div v-for="(plugin, i) in tabViews" :key="i" class="flex items-center justify-center"
        :class="[plugin.show ? 'bg-[#0f162a]' : '']" @click="showTabView(plugin)">
        <span :title="plugin.name" class="material-symbols-outlined  text-center m-3 cursor-pointer">
          {{ plugin.icon }}
        </span>
      </div>
    </div>
    <div class="h-full w-full">
      <div v-show="!tabViews.find(tab => tab.show)" class="text-center h-full w-full">
        HOME
      </div>
      <div v-for="(tabView, i) in tabViews" :key="i" v-show="tabView.show" class="text-center h-full w-full ">
        <iframe @onload="onload" ref="iframe" class="h-full w-full " style="background-color: transparent;"
          allowtransparency="true" :src="tabView.iframe"></iframe>
      </div>
    </div>
    <!--  <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.fullPath"></component>
      </keep-alive>
    </router-view> -->
  </div>
</template>

<style scoped></style>
