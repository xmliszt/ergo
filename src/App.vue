<template>
  <div id="app">
    <h1 class="title">Hi {{ username }}! What's in your mind today?</h1>
    <SignInButton ref="signInButton" />
    <TaskInput
      v-if="!isMobile()"
      ref="taskInput"
      @category-update="onCategoryUpdate"
      @update="onTaskCreated"
    />
    <TaskInputMobile
      v-else
      ref="taskInput"
      @category-update="onCategoryUpdate"
      @update="onTaskCreated"
    />
    <TaskDisplay
      v-if="!isMobile()"
      ref="taskDisplay"
      @update="onTaskUpdate"
      @refreshcategories="onRefreshCategories"
    />
    <TaskDisplayMobile
      v-else
      ref="taskDisplay"
      @update="onTaskUpdate"
      @refreshcategories="onRefreshCategories"
    />
    <Shop @update="onShopUpdate" v-if="!isMobile()" />
    <ShopMobile @update="onShopUpdate" v-else />
  </div>
</template>

<script>
import "./styles/Root.scss";

import Shop from "./components/Shop.vue";
import TaskInput from "./components/TaskInput.vue";
import SignInButton from "./components/SignInButton.vue";
import TaskDisplay from "./components/TaskDisplay.vue";

import ShopMobile from "./components/mobile/ShopMobile.vue";
import TaskInputMobile from "./components/mobile/TaskInputMobile.vue";
import TaskDisplayMobile from "./components/mobile/TaskDisplayMobile.vue";

import { mixinDetictingMobile } from "./mixins";

export default {
  components: {
    Shop,
    TaskInput,
    SignInButton,
    TaskDisplay,
    ShopMobile,
    TaskInputMobile,
    TaskDisplayMobile,
  },
  mixins: [mixinDetictingMobile],
  data() {
    return {
      username: "",
    };
  },
  created() {
    this.$store.watch((user) => {
      this.username = user.username;
    });
  },
  methods: {
    onCategoryUpdate() {
      this.$refs.taskDisplay.refreshTasks();
    },
    onTaskCreated() {
      this.$refs.taskDisplay.refreshTasks();
    },
    onTaskUpdate() {
      this.$refs.signInButton.refreshProfile();
    },
    onShopUpdate() {
      this.$refs.signInButton.refreshProfile();
    },
    onRefreshCategories() {
      this.$refs.taskInput.getAllCategories();
    },
  },
};
</script>

<style lang="scss">
@import "./styles/Variables.scss";

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
  font-family: $font-family;
}

body {
  background-color: $secondary-text-color;
}
</style>
