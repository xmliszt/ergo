<template>
  <div class="task-display">
    <ul style="list-style-type: none; padding: 0; margin: 0">
      <li :key="category.name" v-for="category in categories">
        <el-button @click="openTaskCategory(category)">
          {{ category.name }}
        </el-button>
      </li>
    </ul>
    <el-drawer
      :title="displayCategory"
      :visible.sync="showDrawer"
      direction="btt"
      :before-close="handleClose"
      size="70%"
    >
      <ul style="list-style-type: none; padding: 0; margin: 0">
        <li :key="task.taskId" v-for="task in tasks">
          <div class="single-task-holder">
            <el-button
              icon="el-icon-circle-check"
              circle
              @click="finishTask(task.taskId)"
              :disabled="task.category === 'archive'"
            ></el-button>
            <el-input
              v-model="task.desc"
              @change="updateTask(task.taskId)"
              :disabled="task.category === 'archive'"
            ></el-input>
            due
            <el-date-picker
              v-model="task.due"
              type="datetime"
              :picker-options="dateTimeShortcuts"
              :clearable="false"
              @change="updateTask(task.taskId)"
              :disabled="task.category === 'archive'"
            ></el-date-picker>
            <span>+{{ task.rewards }}</span>
          </div>
        </li>
      </ul>
    </el-drawer>
  </div>
</template>

<script>
import { getTasks, updateTask, getCategories } from "../api/tasks";
import { getThisWeekend, getNextWeekend } from "../utils/datetime";
import "../styles/TaskDisplay.scss";
import { getCookie } from "../utils/cookies";
import { addCoins } from "../api/user";
export default {
  data() {
    return {
      categories: [],
      tasks: [],
      showDrawer: false,
      displayCategory: "",
      dateTimeShortcuts: {
        shortcuts: [
          {
            text: "Today",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "Tomorrow",
            onClick(picker) {
              picker.$emit(
                "pick",
                new Date().setDate(new Date().getDate() + 1)
              );
            },
          },
          {
            text: "This Weekend",
            onClick(picker) {
              picker.$emit("pick", getThisWeekend());
            },
          },
          {
            text: "Next Weekend",
            onClick(picker) {
              picker.$emit("pick", getNextWeekend());
            },
          },
        ],
      },
    };
  },
  methods: {
    updateCategories(categories) {
      this.categories = categories;
    },
    async refreshTaskCategory(category) {
      try {
        let results = await getTasks(getCookie("uid"), category);
        results.sort((a, b) => a.due.getTime() - b.due.getTime());
        this.tasks = results;
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    openTaskCategory(category) {
      this.displayCategory = category.name;
      this.showDrawer = true;
      this.refreshTaskCategory(category.name);
    },
    handleClose() {
      this.displayCategory = "";
      this.showDrawer = false;
    },
    async updateTask(taskId) {
      try {
        let task = this.tasks.find((task) => task.taskId === taskId);
        if (task) {
          await updateTask(
            getCookie("uid"),
            taskId,
            task.category,
            task.desc,
            task.due,
            task.rewards
          );
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    async finishTask(taskId) {
      try {
        let task = this.tasks.find((task) => task.taskId === taskId);
        if (task) {
          let coins = task.rewards;
          await addCoins(getCookie("uid"), coins);
          await updateTask(
            getCookie("uid"),
            taskId,
            "archive",
            task.desc,
            task.due,
            task.rewards
          );
          this.refreshTaskCategory(task.category);
          this.$emit("update");
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    },
  },
  async created() {
    try {
      let cats = await getCategories(getCookie("uid"));
      cats.sort((a, b) => a.priority - b.priority);
      console.log(cats);
      this.categories = cats;
    } catch (err) {
      this.$message.error(err.message);
    }
  },
};
</script>
