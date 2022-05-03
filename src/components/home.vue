<script setup>
import { onMounted, ref } from 'vue'

defineProps({
  msg: String
})

const map = ref(null)
onMounted(()=>{
const dom = document.getElementById('map')
__MAP__.init(dom)
})


</script>

<template>
  <div ref="map" id="map"></div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
a {
  color: #42b983;
}
</style>
