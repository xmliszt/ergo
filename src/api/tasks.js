import { db } from "../firebase";

export async function addCategory(uid, category, priority) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("cat")
      .doc(category)
      .set({
        name: category,
        priority: priority,
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
  if (!uid) uid = "demo";
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("cat")
      .get()
      .then((querySnapshot) => {
        let categories = [];
        querySnapshot.forEach((doc) => {
          categories.push(doc.data());
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
  hasDueDate,
  dueDateTime,
  repeat,
  rewards
) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("tasks")
      .add({
        desc: description,
        category: category,
        hasDueDate,
        due: dueDateTime,
        repeat,
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
  hasDueDate,
  dueDateTime,
  repeat,
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
        hasDueDate,
        due: dueDateTime,
        repeat,
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
            desc: doc.data().desc,
            category: doc.data().category,
            hasDueDate: doc.data().hasDueDate,
            due: doc.data().due.toDate(),
            repeat: doc.data().repeat,
            rewards: doc.data().rewards,
          });
        });
        res(tasks);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function getTaskCount(uid, category) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("tasks")
      .where("category", "==", category)
      .get()
      .then((querySnapshot) => {
        res(querySnapshot.size);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export async function getTaskDueCount(uid, category) {
  return new Promise((res, rej) => {
    db.collection("users")
      .doc(uid)
      .collection("tasks")
      .where("category", "==", category)
      .get()
      .then((querySnapshot) => {
        let count = 0;
        querySnapshot.forEach((doc) => {
          if (doc.data().due.toDate() < new Date()) {
            count++;
          }
        });
        res(count);
      })
      .catch((err) => {
        rej(err);
      });
  });
}
