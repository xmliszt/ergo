import { db } from "../firebase";

export async function doesUserExist(uid) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("profile")
      .doc(uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) res(true);
        else res(false);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function addCoins(uid, coins) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("profile")
      .doc(uid)
      .get()
      .then((snapshot) => {
        let crrtCoins = snapshot.data().coins;
        let newCoins = crrtCoins + coins;
        db.collection("users")
          .doc(uid)
          .collection("profile")
          .doc(uid)
          .update({
            coins: newCoins,
          })
          .then(() => {
            res(true);
          })
          .catch((err) => {
            rej(err);
          });
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function removeCoins(uid, coins) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("profile")
      .doc(uid)
      .get()
      .then((snapshot) => {
        let crrtCoins = snapshot.data().coins;
        if (crrtCoins >= coins) {
          let newCoins = crrtCoins - coins;
          db.collection("users")
            .doc(uid)
            .collection("profile")
            .doc(uid)
            .update({
              coins: newCoins,
            })
            .then(() => {
              res(true);
            })
            .catch((err) => {
              rej(err);
            });
        } else {
          rej(new Error("insufficient coins"));
        }
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function updateLastLoginAt(uid, lastLoginAt) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("profile")
      .doc(uid)
      .update({
        lastLoginAt,
      })
      .then(() => {
        res(true);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function createUserProfile(
  uid,
  username,
  email,
  photoURL,
  lastLoginAt
) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("profile")
      .doc(uid)
      .set({
        username,
        email,
        photoURL,
        lastLoginAt,
        coins: 0,
      })
      .then(() => {
        res(true);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function getUserProfile(uid) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("profile")
      .doc(uid)
      .get()
      .then((querySnapshot) => {
        res(querySnapshot.data());
      })
      .catch((err) => {
        rej(err);
      });
  });
}
