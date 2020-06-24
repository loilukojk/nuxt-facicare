<template>
  <v-container class="grey lighten-5">
    <h1>Hồ sơ cá nhân</h1>
    <v-row no-gutters>
      <v-col :cols="8">Đây là toàn bộ thông tin hồ sơ cá nhân.</v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  created(){
    this.$store.dispatch("setPageTitle", "Hồ sơ cá nhân");
  }
}
</script>