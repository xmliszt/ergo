<template>
  <div id="app">
    <h1 style="margin-top: 10rem; margin-bottom: 4rem; font-size: 5rem">
      What's in your mind today?
    </h1>
    <TaskInput />
    <router-view />
  </div>
</template>

<script>
import TaskInput from "@/components/TaskInput";
export default {
  components: {
    TaskInput,
  },
};
</script>

<style>
@font-face {
  font-family: "ZenLoop";
  src: local("ZenLoop"), url("../src/fonts/ZenLoop-Regular.ttf");
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
}

html,
body {
  font-family: "ZenLoop", "Helvetica Neue", Helvetica, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

body {
  background-color: #252525;
}
</style>
