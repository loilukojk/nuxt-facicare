<template>
  <v-dialog v-model="show" scrollable max-width="450px">
    <v-card>
      <v-card-title class="headline" style="background: #4caf50; color: white">Thêm mới khách hàng</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Tên khách hàng"
                v-model="customer.content.personalInfo.name"
                color="#7f8c8d"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Địa chỉ"
                v-model="customer.content.personalInfo.address"
                color="#7f8c8d"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Số điện thoại"
                v-model="customer.content.personalInfo.phone"
                color="#7f8c8d"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Email"
                v-model="customer.content.personalInfo.email"
                color="#7f8c8d"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="myButtonCustom" style="color:black !important" @click.stop="show=false">Đóng</v-btn>
        <v-btn color="success" class="myButtonCustom" @click="createItem">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    customer: {
      bucket: "crm_app_customer",
      content: {
        id: "",
        personalInfo: {
          name: "",
          phone: "",
          email: "",
          address: ""
        }
      },
      createdByDevice: "facicare",
      creatingDate: "",
      description: "Đây là thông tin khách hàng được tạo từ CRM",
      id: ""
    },
    typeArr: []
  }),
  props: {
    value: Boolean
  },
  computed: {
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
    getCurrentDay: function() {
      let today = new Date();
      let year = today.getFullYear();
      let month =
        today.getMonth() + 1 < 10
          ? "0" + (today.getMonth() + 1)
          : "" + (today.getMonth() + 1);
      let day =
        today.getDate() < 10 ? "0" + today.getDate() : "" + today.getDate();
      let date = year + "/" + month + "/" + day;
      return date;
    },
    getCurrentTime: function() {
      let today = new Date();
      let hour =
        today.getHours() < 10 ? "0" + today.getHours() : "" + today.getHours();
      let minute =
        today.getMinutes() < 10
          ? "0" + today.getMinutes()
          : "" + today.getMinutes();
      let second =
        today.getSeconds() < 10
          ? "0" + today.getSeconds()
          : "" + today.getSeconds();
      let time = hour + ":" + minute + ":" + second;
      return time;
    },
    prepareData: function() {
      let date = this.getCurrentDay();
      let time = this.getCurrentTime();

      this.customer.creatingDate = date + " " + time;
      this.customer.id = this.customer.content.personalInfo.phone;

      return this.customer;
    },
    checkIsNotInfoExist: function() {
      return new Promise((resolve, reject) => {
        // Handle
        let serverDomain = this.$store.getters.getServerDomain;
        let bucket = "crm_app_customer";
        let record = this.customer.content.personalInfo.phone;
        let api = "/api/core/v1/data/detail/" + bucket + "/" + record;
        let url = serverDomain + api;
        let config = {
          headers: this.$store.getters.getAuthConfig
        };

        // call api create technician
        axios
          .get(url, config)
          .then(response => {
            let respBody = response.data;
            if (respBody.code == "-1") {
              resolve("true");
            } else {
              reject("false");
            }
          })
          .catch(e => {
            resolve("true");
          });
      });
    },
    createItem() {
      // check whether info exist or not
      this.checkIsNotInfoExist()
        .then(res => {
          // Handle
          let data = this.prepareData();
          let serverDomain = this.$store.getters.getServerDomain;
          let bucket = "crm_app_customer";
          let record = this.customer.id;
          let api = "/api/core/v1/data/create" + "/" + bucket + "/" + record;
          let url = serverDomain + api;
          let config = {
            headers: this.$store.getters.getAuthConfig
          };

          // call api create technician
          axios
            .post(url, data, config)
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

              // reset form
              this.customer.content.personalInfo = {
                phone: "",
                name: "",
                email: "",
                address: ""
              };

              // dispatch reload customer table
              this.$store.dispatch("getCustomerList");
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
        })
        .catch(err => {
          this.$notify({
            group: "notifications",
            title: "KHÔNG THÀNH CÔNG",
            text: "Số điện thoại đã được sử dụng",
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