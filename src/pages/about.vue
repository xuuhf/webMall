<template>
  <section>
    <h1>{{msg}}</h1>
    <Navbar />
  </section>
</template>

<script>
  import Navbar from '../components/Navbar';

  export default {
    name: 'About',
    components: {
      Navbar
    },
    data() {
      return {
        msg: 'This is the about page.'
      }
    }
  }
</script>