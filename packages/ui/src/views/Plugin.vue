<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useTabViewStore } from "../store/tabViewStore";



const route = useRoute()
const { tabViews } = useTabViewStore()
const tabView = tabViews.find(tab => tab.id === route.params.id)
const iframe = ref()
onMounted(() => {

  //iframe.value.src = "data:text/html;charset=utf-8," + escape("<html><body>NETWORK</body></html>");

})
console.log(tabView);

</script>

<template>
  <div>
    <iframe ref="iframe" class="h-full w-full" style="background-color: transparent;" allowtransparency="true"
      :src="tabView.iframe"></iframe>
  </div>
</template>

<style scoped></style>
