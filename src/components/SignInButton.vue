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
import { googleLoginPopup, logout } from "../api/auth";
import { addCategory } from "../api/tasks";
import {
  doesUserExist,
  createUserProfile,
  updateLastLoginAt,
  getUserProfile,
} from "../api/user";
import { initializeAuthStateWatcher } from "../mixins";

export default {
  mixins: [initializeAuthStateWatcher],
  data() {
    return {
      showSignIn: true,
      email: "",
      coins: 0,
    };
  },
  created() {
    this.initializeWithTimeout(() => {
      this.$store.watch((user) => {
        this.refreshProfile();
      });
    });
  },
  methods: {
    async signIn() {
      try {
        let result = await googleLoginPopup();
        this.showSignIn = false;
        let uid = result.user.uid;
        if (!(await doesUserExist(uid))) {
          await createUserProfile(
            result.user.uid,
            result.user.displayName,
            result.user.email,
            new Date()
          );
          await addCategory(uid, "default", 0);
          await addCategory(uid, "archive", 1);
        } else {
          await updateLastLoginAt(uid, new Date());
        }
        this.$message.success("you have been logged in successfully");
        this.refreshProfile();
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
        this.$message.success("you have been logged out successfully");
        this.refreshProfile();
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    async refreshProfile() {
      let uid = this.$store.getters.user.uid;
      this.email = this.$store.getters.user.email;
      if (this.$store.getters.user.loggedIn) {
        this.showSignIn = false;
      } else {
        this.showSignIn = true;
      }
      try {
        let userProfile = await getUserProfile(uid);
        this.coins = userProfile.coins;
      } catch (err) {
        this.$message.error(err.message);
      }
    },
  },
};
</script>
