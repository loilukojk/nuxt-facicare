<template>
  <v-container class="grey lighten-5">
    <h1>Page not found</h1>
    <v-row no-gutters>
      <v-col :cols="8">Please contact with website admin whenever you need any help.</v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  created(){
    this.$store.dispatch("setPageTitle", "");
  }
}
</script>