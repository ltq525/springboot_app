<template>
  <NavBar />
  <router-view> </router-view>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap'

export default {
  name: "App",
  components: {
    NavBar,
  }

}
</script>

<style>
h {
  color: white;
}

body {
  background-image: url("./assets/images/background.jpg");
  /* 100%填充 */
  background-size: cover;
}

</style>
