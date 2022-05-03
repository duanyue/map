<script setup>
import { onMounted, ref } from 'vue'

defineProps({
  msg: String
})

const map = ref(null)
onMounted(()=>{
console.log('leaflet::',__MAP__)
const dom = document.getElementById('map')
__MAP__.init(dom)
console.log('map::',map)
})


</script>

<template>
  <div ref="map" id="map">你好</div>
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
