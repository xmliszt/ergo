import { auth } from "../firebase";
import { setCookie, deleteCookie } from "../utils/cookies";
import firebase from "firebase/app";

export async function googleLoginPopup() {
  return new Promise((res, rej) => {
    auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        let cred = result.credential;
        let token = cred.accessToken;
        let user = result.user;
        setCookie("token", token);
        setCookie("email", user.email);
        setCookie("uid", user.uid);
        setCookie("username", user.displayName);
        res({
          user: user,
        });
      })
      .catch((err) => {
        let errorCode = err.code;
        let errorMsg = err.message;
        rej({
          code: errorCode,
          message: errorMsg,
        });
      });
  });
}

export function logout() {
  return new Promise((res, rej) => {
    auth
      .signOut()
      .then(() => {
        deleteCookie("token");
        deleteCookie("email");
        deleteCookie("uid");
        deleteCookie("username");
        setCookie("uid", "demo");
        res(true);
      })
      .catch((err) => {
        rej(err);
      });
  });
}
