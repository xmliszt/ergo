<template>
  <div class="signin-btn-wrapper">
    <div class="login-wrapper" v-show="showSignIn">
      <div class="task-text">{{ coins }} coins</div>
      <el-button @click="signIn">Google Sign In</el-button>
    </div>
    <div class="login-wrapper" v-show="!showSignIn">
      <div class="task-text">{{ coins }} coins</div>
      <div class="task-text">|</div>
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
import { getCookie, setCookie } from "../utils/cookies";
import { googleLoginPopup, logout } from "../api/auth";
import { addCategory } from "../api/tasks";
import {
  doesUserExist,
  createUserProfile,
  updateLastLoginAt,
  getUserProfile,
} from "../api/user";

export default {
  data() {
    return {
      showSignIn: true,
      email: "",
      coins: 0,
    };
  },
  methods: {
    async signIn() {
      try {
        let result = await googleLoginPopup();
        this.showSignIn = false;
        if (!(await doesUserExist(result.user.uid))) {
          await createUserProfile(
            result.user.uid,
            result.user.displayName,
            result.user.email,
            new Date()
          );
        } else {
          await updateLastLoginAt(result.user.uid, new Date());
        }
        this.$message.success("you have been logged in successfully");
        let uid = result.user.uid;
        await addCategory(uid, "default", 0);
        await addCategory(uid, "archive", 1);
        this.$emit("login");
      } catch (err) {
        console.error(err);
        this.$message.error(err.message);
        this.showSignIn = true;
      }
    },
    async userLogout() {
      try {
        await logout();
        this.showSignIn = true;
        this.email = "";
        this.$message.success("you have been logged out successfully");
        this.$emit("logout");
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    async refreshProfile() {
      if (!getCookie("uid")) {
        this.showSignIn = true;
        setCookie("uid", "demo");
      } else if (getCookie("uid") !== "demo") {
        this.showSignIn = false;
      }
      let userProfile = await getUserProfile(getCookie("uid"));
      this.email = userProfile.email;
      this.coins = userProfile.coins;
    },
  },
  created() {
    this.refreshProfile();
  },
};
</script>
