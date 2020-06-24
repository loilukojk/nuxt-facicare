<template>
  <v-list dense>
    <v-list-item style="margin: 10px 0px 20px 0px">
      <v-list-item-content>
        <h1>HỆ THỐNG QUẢN LÝ</h1>
      </v-list-item-content>
    </v-list-item>

    <div class="menuItem" v-for="item in menuItems" :key="item.title">
      <v-list-item
        link
        @click="itemClick(item.name)"
        :class="{menuItemActive: item.name===itemClicked}"
      >
        <v-list-item-action class="menuItemIcon">
          <v-icon :class="{menuItemIconActive: item.name===itemClicked}">{{item.icon}}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title :class="{menuItemTitleActive: item.name===itemClicked}">{{item.title}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
  </v-list>
</template>
<script>
export default {
  data: () => {
    return {
      itemClicked: "Dashboard",
      menuItems: [],
      linkMenuItems: {}
    };
  },
  methods: {
    itemClick: function(name) {
      this.$router.push({ name: name }).catch(() => {});
      this.itemClicked = name;
    },
    getItemClicked: function(linkMenuItems) {
      let currentURL = window.location.href;
      let arr = currentURL.split("/");
      let routerLink = arr[arr.length - 1];
      if (arr.length > 3) {
        routerLink = arr[3];
      }
      routerLink = routerLink.replace("-", "_");
      let res = this.linkMenuItems[routerLink];
      return res;
    }
  },
  computed: {
    getMenuItems: () => {
      return [
        {
          name: "Dashboard",
          icon: "mdi-view-dashboard",
          title: "Trang chính"
        },
        {
          name: "Order",
          icon: "mdi-clipboard-flow",
          title: "Đơn hàng"
        },
        {
          name: "Technician",
          icon: "mdi-account-check",
          title: "Kỹ thuật viên"
        },
        {
          name: "Customer",
          icon: "mdi-account",
          title: "Khách hàng"
        }
      ];
    },
    getLinkMenuItems: () => {
      let arr = {
        dashboard: "Dashboard",
        order: "Order",
        order_detail: "Order",
        technician: "Technician",
        customer: "Customer"
      };
      return arr;
    }
  },
  created() {
    this.menuItems = this.getMenuItems;
    this.linkMenuItems = this.getLinkMenuItems;
    this.itemClicked = this.getItemClicked(this.linkMenuItems);
  }
};
</script>
<style scoped>
.menuItem {
  margin: 0px;
  padding: 0px;
}
.menuItemIcon {
  margin-right: 15px;
}
.menuItemActive {
  background: #0097e6;
}
.menuItemIconActive,
.menuItemTitleActive {
  color: white !important;
}
</style>