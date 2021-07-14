import { auth } from "../firebase";
import firebase from "firebase/app";
import { deleteCookie } from "../utils/cookies";

export async function googleLoginPopup() {
  return new Promise((res, rej) => {
    auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        let user = result.user;
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
        deleteCookie("uid");
        res(true);
      })
      .catch((err) => {
        rej(err);
      });
  });
}
