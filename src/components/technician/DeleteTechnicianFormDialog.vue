<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title style="background: #e74c3c; color: white">
        <span class="headline">Xóa kỹ thuật viên</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <p
                style="font-size: 18px !important"
              >Bạn muốn xóa kỹ thuật viên có ID: "{{technician.record_id}}" ???</p>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="myButtonCustom" style="color:black !important" @click.stop="show=false">Đóng</v-btn>
        <v-btn color="error" class="myButtonCustom" @click="deleteTechnician">Xóa</v-btn>
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
    technician: {
      get() {
        return this.$store.getters.getTechnician;
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
    checkAuthentication: function() {
      let isLoggedIn = this.$store.getters.loggedIn;
      if (!isLoggedIn) {
        this.$store.dispatch("startReLogin");
      }
    },
    removeTechnicianInfo: function() {
      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_technician";
      let record = this.technician.record_id;
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

          // reload technician table
          this.$emit("reloadTechnicianTable");
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
    },
    deleteTechnician: function() {
      // Check Authentication
      this.checkAuthentication();

      // call api create a new account
      let data = this.prepareDeleteData();
      let serverDomain = this.$store.getters.getServerDomain;
      let authenBucket = this.$store.getters.getAuthenBucket;
      let api =
        "/api/core/v1/user/delete/" + authenBucket + "/" + data.username;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig,
        data: data
      };
      axios
        .delete(url, config)
        .then(response => {
          if (response.data.code == "0") {
            // Xóa tài khoản thành công
            this.removeTechnicianInfo();
          } else {
            this.$notify({
              group: "notifications",
              title: "HỆ THỐNG",
              text: response.data.message,
              type: "error",
              width: "400px"
            });
          }
        })
        .catch(e => {
          this.$notify({
            group: "notifications",
            title: "XẢY RA LỖI",
            text: "Không thể xóa tài khoản đăng nhập của KTV",
            type: "error",
            width: "400px"
          });
        });
    },
    prepareDeleteData: function() {
      return {
        username: this.technician.data_item.content.username,
        password: this.technician.data_item.content.password
      };
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