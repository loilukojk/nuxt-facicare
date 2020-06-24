<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <AppLeftNavigation />
    </v-navigation-drawer>

    <app-top-navigation @changeDrawer="drawer=!drawer" />

    <v-main transition="slide-x-transition">
      <router-view></router-view>
    </v-main>

    <!-- <v-footer color="indigo" app>
      <span class="white--text">Team thực hiện &copy; 2019</span>
    </v-footer>-->

    <notifications group="notifications" position="bottom right" />
  </v-app>
</template>

<script>
import AppLeftNavigation from "./components/AppLeftNavigation";
import AppTopNavigation from "./components/AppTopNavigation";
import pushNotificationSDK from "./pushNotificationSDK/index";

export default {
  data: () => ({
    drawer: null
  }),
  components: {
    AppLeftNavigation,
    AppTopNavigation
  },
  methods: {
    connectToPushNotificationServer: function() {
      let loggedIn = this.$store.getters.loggedIn;
      if (loggedIn) {
        this.$store.dispatch("connectToPushNotificationServer");
      }
    }
  },
  created() {
    this.connectToPushNotificationServer();
  }
};
</script>