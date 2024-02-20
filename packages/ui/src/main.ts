import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')


import { io } from "socket.io-client";


//@ts-ignore
const socket = io("http://192.168.1.24:3000");
console.log(socket);

socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});
socket.on("connect_error", (e) => {
    setTimeout(() => {
        // alert(e)
    }, 1000);
});
socket.on("disconnect", () => {
    console.log(socket.id); // undefined
});

socket.on("cdp", (data) => {
    console.log(data); // undefined
});

