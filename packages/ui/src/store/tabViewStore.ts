import { defineStore } from "pinia"
import { ref } from "vue"
import { DevToolsTabView } from "@nativescript-community/devtools-shared/src"


export const useTabViewStore = defineStore('tabView', () => {
    const tabViews = ref<DevToolsTabView[]>([])

    function addTabView(plugin: DevToolsTabView) {
        tabViews.value.push(plugin);
    }
    function showTabView(plugin: DevToolsTabView) {
        tabViews.value.forEach(tab => (tab.show = false))
        if (plugin)
            tabViews.value.find(tab => tab.id === plugin.id).show = true;
    }
    return { tabViews, addTabView, showTabView }
})