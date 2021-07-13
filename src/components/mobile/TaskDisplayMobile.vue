<template>
  <div class="task-display-mobile">
    <ul style="list-style-type: none; padding: 0; margin: 0">
      <li :key="category.name" v-for="category in categories">
        <el-button @click="openTaskCategory(category)">
          {{ category.name }} - {{ taskCounts[category.name] }}
          <span style="color: #ff7a7a; margin-left: 20px"
            >Due: {{ taskDueCounts[category.name] }}</span
          >
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
          <div class="single-task-holder-mobile">
            <el-button
              icon="el-icon-circle-check"
              circle
              @click="finishTask(task.taskId)"
              :disabled="task.category === 'archive'"
            ></el-button>
            <div class="item-wrapper-mobile">
              <div
                class="due-input-wrapper"
                v-if="task.hasDueDate && task.due < new Date()"
              >
                <el-input
                  v-model="task.desc"
                  @change="updateTask(task.taskId)"
                  :disabled="task.category === 'archive'"
                ></el-input>
              </div>
              <div class="not-due-input-wrapper" v-else>
                <el-input
                  v-model="task.desc"
                  @change="updateTask(task.taskId)"
                  :disabled="task.category === 'archive'"
                ></el-input>
              </div>
              <span>+{{ task.rewards }}</span>
              <el-button
                icon="el-icon-close"
                circle
                @click="deleteTask(task.taskId)"
              ></el-button>
            </div>
          </div>
          <el-collapse>
            <el-collapse-item>
              <div class="single-task-collapse-content-wrapper">
                <div class="due-wrapper-mobile">
                  <div
                    class="due-input-wrapper"
                    v-if="task.hasDueDate && task.due < new Date()"
                  >
                    Due
                  </div>
                  <div v-else>Due</div>
                  <el-switch
                    style="margin: 0 1rem"
                    v-model="task.hasDueDate"
                    :disabled="task.category === 'archive'"
                    active-color="#303133"
                    @change="updateTask(task.taskId)"
                  >
                  </el-switch>
                </div>
                <div class="due-wrapper-mobile">
                  <div class="item-wrapper-mobile">
                    <div
                      class="due-input-wrapper"
                      v-if="task.hasDueDate && task.due < new Date()"
                    >
                      <el-date-picker
                        v-model="task.due"
                        type="datetime"
                        :picker-options="dateTimeShortcuts"
                        :clearable="false"
                        @change="updateTask(task.taskId)"
                        v-show="task.hasDueDate"
                        :disabled="task.category === 'archive'"
                      ></el-date-picker>
                    </div>
                    <div class="not-due-input-wrapper" v-else>
                      <el-date-picker
                        v-model="task.due"
                        type="datetime"
                        :picker-options="dateTimeShortcuts"
                        :clearable="false"
                        @change="updateTask(task.taskId)"
                        v-show="task.hasDueDate"
                        :disabled="task.category === 'archive'"
                      ></el-date-picker>
                    </div>
                  </div>
                  <div class="item-wrapper-mobile">
                    <el-select
                      v-model="task.repeat"
                      @change="updateTask(task.taskId)"
                      :disabled="task.category === 'archive'"
                      v-show="task.hasDueDate"
                    >
                      <el-option
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                        v-for="option in repeatOptions"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </li>
      </ul>
    </el-drawer>
  </div>
</template>

<script>
import {
  getTasks,
  updateTask,
  getCategories,
  deleteTask,
  getTaskCount,
  getTaskDueCount,
} from "../../api/tasks";
import "../../styles/TaskDisplayMobile.scss";
import {
  getThisWeekend,
  getNextWeekend,
  getTomorrow,
} from "../../utils/datetime";
import { getCookie } from "../../utils/cookies";
import { addCoins } from "../../api/user";
export default {
  data() {
    return {
      categories: [],
      tasks: [],
      taskCounts: {},
      taskDueCounts: {},
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
              picker.$emit("pick", getTomorrow());
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
      dueColor: "color: #F56C6C;",
      notDueColor: "color: #303133;",
      repeatOptions: [
        {
          label: "No Repeat",
          value: "no-repeat",
        },
        {
          label: "Everyday",
          value: "everyday",
        },
        {
          label: "Once A Week",
          value: "once-a-week",
        },
        {
          label: "Once A Month",
          value: "once-a-month",
        },
        {
          label: "Once A Year",
          value: "once-a-year",
        },
      ],
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
      this.refreshTasks();
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
            task.hasDueDate,
            task.due,
            task.repeat,
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

          let repeatOption = task.repeat;

          switch (repeatOption) {
            case "no-repeat":
              await updateTask(
                getCookie("uid"),
                taskId,
                "archive",
                task.desc,
                task.hasDueDate,
                task.due,
                task.repeat,
                task.rewards
              );
              break;
            case "everyday":
              await updateTask(
                getCookie("uid"),
                taskId,
                task.category,
                task.desc,
                task.hasDueDate,
                new Date(task.due.getTime() + 24 * 60 * 60 * 1000),
                task.repeat,
                task.rewards
              );
              break;
            case "once-a-week":
              await updateTask(
                getCookie("uid"),
                taskId,
                task.category,
                task.desc,
                task.hasDueDate,
                new Date(task.due.getTime() + 7 * 24 * 60 * 60 * 1000),
                task.repeat,
                task.rewards
              );
              break;
            case "once-a-month":
              await updateTask(
                getCookie("uid"),
                taskId,
                task.category,
                task.desc,
                task.hasDueDate,
                new Date(task.due.getTime() + 30 * 7 * 24 * 60 * 60 * 1000),
                task.repeat,
                task.rewards
              );
              break;
            case "once-a-year":
              await updateTask(
                getCookie("uid"),
                taskId,
                task.category,
                task.desc,
                task.hasDueDate,
                new Date(task.due.getTime() + 365 * 24 * 60 * 60 * 1000),
                task.repeat,
                task.rewards
              );
              break;
          }
          await this.refreshTaskCategory(this.displayCategory);
          this.$message.success("finished task");
          this.$emit("update");
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    async deleteTask(taskId) {
      try {
        let task = this.tasks.find((task) => task.taskId === taskId);
        if (task) {
          await deleteTask(getCookie("uid"), taskId);
          await this.refreshTaskCategory(this.displayCategory);
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    async refreshTasks() {
      getCategories(getCookie("uid"))
        .then(async (cats) => {
          cats.sort((a, b) => a.priority - b.priority);
          this.categories = cats;
          cats.forEach(async (category) => {
            try {
              let count = await getTaskCount(getCookie("uid"), category.name);
              this.taskCounts[category.name] = count;
              count = await getTaskDueCount(getCookie("uid"), category.name);
              this.taskDueCounts[category.name] = count;
              await this.refreshTaskCategory(category.name);
            } catch (err) {
              this.$message.error(err.message);
            }
          });
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
  },
  created() {
    this.refreshTasks();
  },
};
</script>
