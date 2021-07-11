import { db } from "../firebase";

export async function addCategory(uid, category) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("cat")
      .doc(category)
      .set({
        name: category,
      })
      .then(() => {
        res(true);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function updateCategory(uid, category, newCategory) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("cat")
      .doc(category)
      .update({
        name: newCategory,
      })
      .then(() => {
        res(true);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function getCategories(uid) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("cat")
      .get()
      .then((querySnapshot) => {
        let categories = [];
        querySnapshot.forEach((doc) => {
          categories.push(doc.id);
        });
        res(categories);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function deleteCategory(uid, category) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("cat")
      .doc(category)
      .delete()
      .then(() => {
        res(true);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function addNewTask(
  uid,
  category,
  description,
  dueDateTime,
  rewards
) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("tasks")
      .add({
        desc: description,
        category: category,
        due: dueDateTime,
        rewards: rewards,
      })
      .then((doc) => {
        res(doc.id);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function updateTask(
  uid,
  taskID,
  category,
  description,
  dueDateTime,
  rewards
) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("tasks")
      .doc(taskID)
      .update({
        desc: description,
        category: category,
        due: dueDateTime,
        rewards: rewards,
      })
      .then(() => {
        res(true);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function deleteTask(uid, taskID) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("tasks")
      .doc(taskID)
      .delete()
      .then(() => {
        res(true);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function getTasks(uid, category) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("tasks")
      .where("category", "==", category)
      .get()
      .then((querySnapshot) => {
        let tasks = [];
        querySnapshot.forEach((doc) => {
          tasks.push({
            taskId: doc.id,
            desc: doc.desc,
            category: doc.category,
            due: doc.due,
            rewards: doc.rewards,
          });
        });
        res(tasks);
      })
      .catch((err) => {
        rej(err);
      });
  });
}