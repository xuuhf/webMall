import Vue from 'vue'; // 从node_modules引入vue类库
import App from './app'; // ES6 语法，相当于 import { default as App } from './app.vue'。因为app.vue用过的是export default {...}，所以可以这样写
import router from './router';

import './assets/styles/global.scss';

new Vue({
    el: '#app',
    components: {
        App
    },
    router,
    /**
     * Vue2.x 区分了完整版和运行时版，然后当使用 webpack 的时候默认是只包含运行时的 ES Module 版本。
     * 运行时版不包括编译器【用来将模板字符串编译成为 JavaScript 渲染函数的代码】，所以不能用 template，要用 render 函数。
     * 而.vue文件里能写<template>则是因为vue-loader会处理，把<template>里的内容转换成 render() 函数的内容。
     * 参考：https://cn.vuejs.org/v2/guide/installation.html#%E5%AF%B9%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A
     */
    render: (createElement) => createElement(App)
});

// 测试babel-loader
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    sayHello() {
        console.log(`Hello, my name is ${this.name}`);
    }
}

const person = new Person("Ben", 28);
person.sayHello();