<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title style="background: #e74c3c; color: white">
        <span class="headline">Xóa đơn hàng</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <p
                style="font-size: 18px !important"
              >Bạn muốn xóa đơn hàng có ID: "{{order.record_id}}" ???</p>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="myButtonCustom" style="color:black !important" @click.stop="show=false">Đóng</v-btn>
        <v-btn color="#e74c3c" class="myButtonCustom" @click="deleteOrder">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: {
    value: Boolean
  },
  computed: {
    order: {
      get() {
        return this.$store.getters.getOrder;
      }
    },
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    deleteOrder: function() {
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/data/delete" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      // call api delete record
      axios
        .delete(url, config)
        .then(response => {
          // close form & notify to the screen
          this.show = false;
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Thao tác đã được thực hiện!",
            type: "success",
            width: "400px"
          });

          // reload order table
          this.$emit("reloadOrderTable");
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            group: "notifications",
            title: "XẢY RA LỖI",
            text: "Thao tác đã không được thực hiện!",
            type: "error",
            width: "400px"
          });
        });
    }
  }
};
</script>

<style scoped>
label,
input,
textarea {
  font-size: 18px !important;
}
.myButtonCustom {
  font-size: 15px !important;
}
.blackColor {
  color: black !important;
}
</style>