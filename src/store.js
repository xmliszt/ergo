import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      uid: "demo",
      email: null,
      username: "",
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_UID(state, uid) {
      state.user.uid = uid;
    },
    SET_EMAIL(state, email) {
      state.user.email = email;
    },
    SET_USERNAME(state, username) {
      state.user.username = username;
    },
  },
  actions: {
    updateUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_UID", user.uid);
        commit("SET_EMAIL", user.email);
        commit("SET_USERNAME", user.displayName);
      } else {
        commit("SET_UID", "demo");
        commit("SET_EMAIL", null);
        commit("SET_USERNAME", "");
      }
    },
  },
});
