import { db } from "../firebase";

export async function createItem(uid, name, price) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("shop")
      .add({
        name,
        price,
      })
      .then(() => {
        res(true);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function getItems(uid) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("shop")
      .get()
      .then((snapshots) => {
        let items = [];
        snapshots.forEach((doc) => {
          items.push({
            itemId: doc.id,
            name: doc.data().name,
            price: doc.data().price,
          });
        });
        res(items);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function removeItem(uid, itemId) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("shop")
      .doc(itemId)
      .delete()
      .then(() => {
        res(true);
      })
      .catch((err) => {
        rej(err);
      });
  });
}
