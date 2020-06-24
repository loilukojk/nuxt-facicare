<template></template>

<script>
import pushNotificationSDK from '../pushNotificationSDK/index'
export default {
  created() {
    pushNotificationSDK.notification.Disconnect();
    this.$store.dispatch("clearUserInfo");
    this.$store.dispatch("destroyToken").then(response => {
      this.$router.push({ name: "Login" });
    });
  }
};
</script>