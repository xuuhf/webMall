<template>
  <section>
    <h1 class="color-red">{{msg}}</h1>
    <Navbar />
  </section>
</template>

<script>
  import Navbar from '../components/Navbar';

  export default {
    name: 'HelloWorld',
    components: {
      Navbar
    },
    data() {
      return {
        msg: 'Hello, Vue!'
      }
    }
  }
</script>

<style scoped>
  .color-red {
    color: red;
  }
</style>