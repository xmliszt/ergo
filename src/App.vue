<template>
  <div id="app">
    <h1 class="title">Hi {{ username }}! What's in your mind today?</h1>
    <TaskInput />
    <SignInButton @logout="onUserLogout" @login="onUserLogin" />
  </div>
</template>

<script>
import "./styles/Root.scss";
import TaskInput from "@/components/TaskInput";
import SignInButton from "@/components/SignInButton";
import { getCookie } from "./utils/cookies";
export default {
  components: {
    TaskInput,
    SignInButton,
  },
  data() {
    return {
      username: "",
    };
  },
  created() {
    this.username = getCookie("username");
  },
  methods: {
    onUserLogout() {
      this.username = "";
    },
    onUserLogin() {
      this.username = getCookie("username");
    },
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
