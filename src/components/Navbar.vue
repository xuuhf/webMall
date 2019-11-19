<template>
  <ul class="navbar">
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/">Home</router-link>
    <router-link to="/helloworld">Helloworld</router-link>
    <router-link to="/about">About</router-link>
  </ul>
</template>

<script>
  export default {
    name: 'Navbar'
  }
</script>

<style scoped>
  .navbar {
    display: flex;
    margin: 0;
    padding: 0;
    flex-direction: column;
  }
</style>