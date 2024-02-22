import { createRouter, createWebHashHistory } from 'vue-router'
import Home from "./views/Home.vue"
import Plugin from "./views/Plugin.vue"

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            component: Home
        },
        {
            path: "/plugin/:id",
            component: Plugin,
            props: true
        }
    ],
});