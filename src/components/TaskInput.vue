<template>
  <div class="task-input">
    <div class="task-input-wrapper">
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
            <div class="task-text">{{ taskForm.description }}</div>
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
          </el-form-item>
          <el-form-item label="Due Date">
            <el-date-picker
              v-model="taskForm.dueDateTime"
              type="datetime"
              :picker-options="dateTimeShortcuts"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="Rewards">
            <div class="rewards-wrapper">
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
              <div class="task-text">{{ taskForm.rewards }}</div>
            </div>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import "@/styles/TaskInput.scss";
import { getThisWeekend, getNextWeekend } from "../utils/datetime";
import { addCategory, getCategories } from "../api/tasks";
import { getCookie } from "../utils/cookies";

export default {
  data() {
    return {
      activeName: "",
      taskForm: {
        description: "",
        category: "",
        dueDateTime: new Date(),
        rewards: 1,
      },
      dateTimeShortcuts: {
        shortcuts: [
          {
            text: "Today",
            onClick(picker) {
              picker.$emit("pick", new Date());
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
      rewardMarks: {},
      categories: [],
    };
  },
  created() {
    this.rewardMarks = this.getRewardMarks();
    this.getAllCategories();
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
    getRewardMarks() {
      var marks = Object();
      for (var i = 1; i <= 10; i++) {
        marks[i] = `${i}`;
      }
      return marks;
    },
    async onCategoryChange(value) {
      let currentCategories = [];
      this.categories.forEach((cat) => {
        currentCategories.push(cat.label);
      });
      if (!currentCategories.includes(value)) {
        try {
          await addCategory(getCookie("uid"), value);
          this.getAllCategories();
        } catch (err) {
          this.$message.error(err);
        }
      }
    },
    async getAllCategories() {
      this.categories = [];
      let cats = [];
      try {
        let uid = getCookie("uid");
        cats = await getCategories(uid);
        cats.forEach((cat) => {
          this.categories.push({
            label: cat,
            value: cat,
          });
        });
        this.taskForm.category = "default";
      } catch (err) {
        console.error(err);
        this.$message.error(err.message);
      }
    },
  },
};
</script>
