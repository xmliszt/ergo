<template>
  <div class="shop-view">
    <div class="shop-btn-holder">
      <el-button circle icon="el-icon-goods" @click="openShop"></el-button>
    </div>
    <el-drawer
      title="Shop"
      :visible.sync="shopOpen"
      direction="ltr"
      size="50%"
      :before-close="handleClose"
      custom-class="shop-wrapper"
    >
      <el-form
        ref="itemForm"
        :rules="rules"
        :model="itemForm"
        label-width="120px"
      >
        <el-form-item prop="name" label="Item Name">
          <el-input v-model="itemForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="price" label="Price">
          <el-input-number
            v-model="itemForm.price"
            :min="1"
            :step="1"
            step-strictly
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="submitForm">Submit</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="shop-item-list">
        <div class="shop-item-wrapper" v-for="item in items" :key="item.name">
          <div style="display: flex">
            <el-avatar icon="el-icon-s-goods"></el-avatar>
            <div class="task-text">{{ item.name }}</div>
          </div>
          <div style="display: flex">
            <el-tag type="info">Price: {{ item.price }}</el-tag>
            <el-button
              type="success"
              size="mini"
              round
              @click="buyItem(item.price)"
              >Buy</el-button
            >
            <el-button
              class="close-icon"
              icon="el-icon-close"
              @click="removeItem(item.itemId)"
            ></el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import "../styles/Shop.scss";
import { getItems, createItem, removeItem } from "../api/shop";
import { removeCoins } from "../api/user";
export default {
  data() {
    return {
      shopOpen: false,
      itemForm: {
        name: "",
        price: 1,
      },
      items: [],
      rules: {
        name: [
          {
            required: true,
            message: "Please input shop item name",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    openShop() {
      this.shopOpen = true;
      this.getShopItems();
    },
    handleClose() {
      this.shopOpen = false;
    },
    buyItem(price) {
      removeCoins(this.$store.getters.user.uid, price)
        .then(() => {
          this.$message.warning("shop item consumed");
          this.$emit("update");
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    removeItem(itemId) {
      removeItem(this.$store.getters.user.uid, itemId)
        .then(() => {
          this.$message.warning("item deleted");
          this.getShopItems();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    submitForm() {
      this.$refs.itemForm.validate((valid) => {
        if (valid) {
          createItem(
            this.$store.getters.user.uid,
            this.itemForm.name,
            this.itemForm.price
          )
            .then(() => {
              this.$message.success("shop item created");
              this.getShopItems();
              this.$refs.itemForm.resetFields();
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        } else {
          return false;
        }
      });
    },
    async getShopItems() {
      try {
        let items = await getItems(this.$store.getters.user.uid);
        items.sort((a, b) => a.price - b.price);
        this.items = items;
      } catch (err) {
        this.$message.error(err.message);
      }
    },
  },
  created() {
    setTimeout(() => {
      this.$store.watch((user) => {
        this.getShopItems();
      });
    }, 1000);
  },
};
</script>
