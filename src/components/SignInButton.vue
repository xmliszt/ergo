<template>
  <div class="signin-btn-wrapper">
    <el-button @click="signIn" v-show="showSignIn">Google Sign In</el-button>
    <div class="login-wrapper" v-show="!showSignIn">
      <div class="task-text">{{ email }}</div>
      <el-button
        @click="userLogout"
        icon="el-icon-circle-close"
        size="small"
        circle
      ></el-button>
    </div>
  </div>
</template>

<script>
import "../styles/SignInButton.scss";
import { getCookie } from "../utils/cookies";
import { googleLoginPopup, logout } from "../api/auth";

export default {
  data() {
    return {
      showSignIn: true,
      email: "",
    };
  },
  methods: {
    async signIn() {
      try {
        let result = await googleLoginPopup();
        this.email = result.user.email;
        this.showSignIn = false;
        this.$message.success("you have been logged in successfully");
        this.$emit("login");
      } catch (err) {
        console.error(err);
        this.$message.error(err.message);
        this.showSignIn = true;
      }
    },
    userLogout() {
      logout();
      this.showSignIn = true;
      this.email = "";
      this.$message.success("you have been logged out successfully");
      this.$emit("logout");
    },
  },
  created() {
    if (getCookie("token")) {
      this.showSignIn = false;
      this.email = getCookie("email");
    } else {
      this.showSignIn = true;
    }
  },
};
</script>
