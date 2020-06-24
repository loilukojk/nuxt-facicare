<template>
  <v-app-bar app color="#0097e6" dark>
    <v-app-bar-nav-icon @click.stop="changeDrawer" />
    <v-toolbar-title>{{pageTitle}}</v-toolbar-title>
    <v-spacer></v-spacer>

    <div style="margin-right: 10px; margin-top: 5px">
      <v-menu bottom left offset-y>
        <template v-slot:activator="{ on }">
          <div v-on="on" style="cursor:pointer">
            <v-badge color="#f1c40f" overlap>
              <!-- <template v-if="notifications.length > 0" slot="badge">{{ notifications.length }}</template> -->
              <template v-if="numberOfNotifications > 0" slot="badge">{{ numberOfNotifications }}</template>
              <template v-else slot="badge">0</template>
              <v-icon color="#34495e" style="font-size: 30px">mdi-bell</v-icon>
            </v-badge>
          </div>
        </template>
        <v-card v-if="notifications.length > 0" max-width="350px" max-height="350px">
          <v-list
            v-for="(item, index) in notifications"
            :key="index"
            dense
            style="margin: 0px; padding: 0px; cursor: pointer"
          >
            <v-list-item @click="viewOrderDetail(item.data_item.content.content.orderID, item)">
              <v-list-item-avatar>
                <div :style="statusColor(item.data_item.content.content.currentOrderStatus)"></div>
              </v-list-item-avatar>

              <v-list-item-content v-if="item.data_item.content.isNew == '1'">
                <v-list-item-title>{{item.data_item.content.content.orderID}}</v-list-item-title>
                <v-list-item-title>{{item.data_item.content.content.msg}}</v-list-item-title>
                <v-list-item-title>{{item.data_item.content.datetime}}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content v-else>
                <v-list-item-subtitle>{{item.data_item.content.content.orderID}}</v-list-item-subtitle>
                <v-list-item-subtitle>{{item.data_item.content.content.msg}}</v-list-item-subtitle>
                <v-list-item-subtitle>{{item.data_item.content.datetime}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
          </v-list>
        </v-card>
      </v-menu>
    </div>

    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <img
          src="../assets/user_avatar2.png"
          style="max-width: 50px; max-height: 50px; cursor: pointer; border-radius: 25px; margin-left: 10px"
          v-on="on"
        />
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index">
          <v-list-item-title @click="itemClick(item.name)" style="cursor:pointer">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    username: "",
    items: [
      { title: "Hồ sơ cá nhân", name: "UserProfile", link: "/user-profile" },
      { title: "Đăng xuất", name: "Logout", link: "/logout" }
    ],
    numberOfNotifications: 0
  }),
  computed: {
    notifications() {
      let result = this.$store.state.notificationHistory;
      for (let i = 0; i < result.length; i++) {
        if (result[i].data_item.content.isNew == "1") {
          this.numberOfNotifications += 1;
        }
      }
      return result;
    },
    pageTitle: function() {
      return this.$store.getters.pageTitle;
    },
    usernameValue: function() {
      return this.username;
    }
  },
  methods: {
    changeDrawer: function() {
      this.$emit("changeDrawer");
    },
    itemClick: function(name) {
      this.$router.push({ name: name }).catch(() => {});
    },
    statusColor: function(orderStatus) {
      switch (orderStatus) {
        case "0":
          return "background: #e74c3c; width: 100%; height: 100%";

        case "1":
          return "background: #e67e22; width: 100%; height: 100%";

        case "2":
          return "background: #f1c40f; width: 100%; height: 100%";

        case "2a":
          return "background: #e74c3c; width: 100%; height: 100%";

        case "2b":
          return "background: #f39c12; width: 100%; height: 100%";

        case "3":
          return "background: #3498db; width: 100%; height: 100%";

        case "6":
          return "background: #3498db; width: 100%; height: 100%";

        case "4":
          return "background: #3498db; width: 100%; height: 100%";

        case "5":
          return "background: #27ae60; width: 100%; height: 100%";

        case "7":
          return "background: #95a5a6; width: 100%; height: 100%";

        case "8":
          return "background: #34495e; width: 100%; height: 100%";

        case "2c":
          return "background: #9b59b6; width: 100%; height: 100%";

        default:
          return "background: #b2bec3; width: 100%; height: 100%";
      }
    },
    viewOrderDetail: function(orderID, item) {
      // update this notification is not new
      let recordID = item.record_id;
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_push_notification";
      let api =
        "/api/core/v1/data/update_one/crm_app_push_notification/" +
        recordID +
        "/content/isNew";
      let url = serverDomain + api;
      let data = "'0'";
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      config.headers["Content-Type"] = "text/plain";
      axios
        .patch(url, JSON.stringify(data), config)
        .then(res => {
          // redirect to order-detail page
          let currentURL = window.location.href.split("/");
          if (currentURL[currentURL.length - 2] == "order-detail") {
            // move to order-detail page
            let path = "/facicare/order-detail" + "/" + orderID;
            this.$router.push({ path: path }).catch(() => {});

            // reload with current page
            this.$router.go();
          } else {
            // move to order-detail page
            let path = "/facicare/order-detail" + "/" + orderID;
            this.$router.push({ path: path }).catch(() => {});

            // reload with current page
            this.$router.go();
          }
        })
        .catch(err => {});
    }
  },
  created() {
    // this.$store.dispatch("getNotificationHistory");
  },
  mounted() {
    this.username = localStorage.getItem("fullname");
  },
  updated() {
    this.username = localStorage.getItem("fullname");
  }
};
</script>