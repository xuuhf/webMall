<template>
  <section>
    <h1>{{msg}}</h1>
    <Navbar />
  </section>
</template>

<script>
  import Navbar from '../components/Navbar';

  export default {
    name: 'Home',
    components: {
      Navbar
    },
    data() {
      return {
        msg: 'This is the home page.'
      }
    },
    mounted() {
      console.log('mounted', this.$route); // 可以用this.$route来获得全局的 router 实例
    }
  }
</script>