<template>
  <div class="task-input-mobile">
    <div class="task-input-wrapper-mobile">
      <el-input
        v-model="taskForm.description"
        clearable
        autofocus
        @change="onTaskEnter"
        @input="onTaskInputChange"
      ></el-input>
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="1" disabled>
        <el-form
          ref="taskForm"
          v-model="taskForm"
          label-width="200px"
          size="small"
        >
          <el-form-item label="Description">
            <div class="task-text-mobile">{{ taskForm.description }}</div>
          </el-form-item>
          <el-form-item label="Category">
            <el-select
              v-model="taskForm.category"
              filterable
              allow-create
              default-first-option
              @change="onCategoryChange"
            >
              <el-option
                :key="category.value"
                :label="category.label"
                :value="category.value"
                v-for="category in categories"
              ></el-option>
            </el-select>
            <span style="color: #fff"
              >Create your own category by typing in</span
            >
          </el-form-item>
          <el-form-item label="Has Due Date">
            <el-switch
              v-model="taskForm.hasDueDate"
              active-color="#303133"
            ></el-switch>
          </el-form-item>
          <el-form-item label="Due Date" v-show="taskForm.hasDueDate">
            <el-date-picker
              v-model="taskForm.dueDateTime"
              type="datetime"
              :picker-options="dateTimeShortcuts"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="Repeat" v-show="taskForm.hasDueDate">
            <el-select v-model="taskForm.repeat">
              <el-option
                :key="option.value"
                :label="option.label"
                :value="option.value"
                v-for="option in repeatOptions"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Rewards">
            <div class="rewards-wrapper-mobile">
              <div style="width: 95%; margin-right: 20px">
                <el-slider
                  v-model="taskForm.rewards"
                  :min="1"
                  :max="10"
                  :step="1"
                  show-stops
                  :show-tooltip="false"
                  :marks="rewardMarks"
                ></el-slider>
              </div>
              <div class="task-text-mobile">{{ taskForm.rewards }}</div>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="submit-btn-wrapper-mobile">
              <el-button @click="addTask">Add Task</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import "../../styles/TaskInputMobile.scss";
import { datetimeShortcuts, repeatOptions } from "../../mixins";
import { getRewardMarks } from "../../utils/inputs";
import { addCategory, getCategories, addNewTask } from "../../api/tasks";

export default {
  mixins: [datetimeShortcuts, repeatOptions],
  data() {
    return {
      activeName: "",
      taskForm: {
        description: "",
        category: "",
        repeat: "no-repeat",
        hasDueDate: false,
        dueDateTime: new Date(),
        rewards: 1,
      },
      rewardMarks: {},
      categories: [],
      highestPriority: 0,
    };
  },
  created() {
    this.rewardMarks = getRewardMarks();
    setTimeout(() => {
      this.$store.watch((user) => {
        this.getAllCategories();
      });
    }, 1000);
  },
  methods: {
    onTaskEnter() {
      if (this.taskForm.description.length > 0) {
        this.activeName = "1";
      } else {
        this.activeName = "";
      }
    },
    onTaskInputChange() {
      if (this.taskForm.description.length === 0) {
        this.activeName = "";
      }
    },
    async addTask() {
      try {
        await addNewTask(
          this.$store.getters.user.uid,
          this.taskForm.category,
          this.taskForm.description,
          this.taskForm.hasDueDate,
          this.taskForm.dueDateTime,
          this.taskForm.repeat,
          this.taskForm.rewards
        );
        this.$message.success("task is successfully created");
        this.taskForm.description = "";
        this.onTaskInputChange();
        this.$emit("update");
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    async onCategoryChange(value) {
      let currentCategories = [];
      this.categories.forEach((cat) => {
        currentCategories.push(cat.label);
      });
      if (!currentCategories.includes(value)) {
        try {
          await addCategory(
            this.$store.getters.user.uid,
            value,
            this.highestPriority + 1
          );
          this.getAllCategories();
        } catch (err) {
          this.$message.error(err.message);
        }
      }
      this.taskForm.category = value;
    },
    async getAllCategories() {
      this.categories = [];
      let cats = [];
      try {
        let uid = this.$store.getters.user.uid;
        cats = await getCategories(uid);
        cats.sort((a, b) => a.priority - b.priority);
        cats.forEach((cat) => {
          this.categories.push({
            label: cat.name,
            value: cat.name,
          });
          if (cat.priority > this.highestPriority) {
            this.highestPriority = cat.priority;
          }
        });
        this.taskForm.category = this.categories[0].label;
        this.$emit("category-update");
      } catch (err) {
        console.error(err);
        this.$message.error(err.message);
      }
    },
  },
};
</script>
