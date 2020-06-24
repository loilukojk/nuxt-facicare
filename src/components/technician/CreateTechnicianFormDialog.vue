<template>
  <v-dialog v-model="show" scrollable max-width="650px">
    <v-card>
      <v-card-title
        class="headline"
        style="background: #4caf50; color: white"
      >Thêm mới kỹ thuật viên</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row>
            <v-col class="removePaddingTopBottom" md="6">
              <v-text-field label="Tên" v-model="technician.content.first_name" color="#7f8c8d"></v-text-field>
            </v-col>
            <v-col class="removePaddingTopBottom" md="6">
              <v-text-field label="Họ" v-model="technician.content.last_name" color="#7f8c8d"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="6">
              <v-text-field
                label="Số điện thoại"
                v-model="technician.content.phone_number"
                color="#7f8c8d"
              ></v-text-field>
            </v-col>
            <v-col class="removePaddingTopBottom" md="6">
              <v-text-field label="Email" v-model="technician.content.email" color="#7f8c8d"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field label="Địa chỉ" v-model="technician.content.address" color="#7f8c8d"></v-text-field>
            </v-col>
          </v-row>
          <v-row style="padding-top: 15px">
            <v-col class="removePaddingTopBottom" md="12">
              <fieldset class="fieldset-info-box">
                <legend
                  style="margin-left: 10px; font-size: 16px; color:rgba(0, 0, 0, 0.6)"
                >Chuyên môn</legend>
                <v-row class="input-group">
                  <v-col md="4">
                    <v-checkbox
                      dense
                      style="padding: 0px !important; margin: 0px !important"
                      v-model="typeArr"
                      label="HT Lạnh"
                      value="HT Lạnh"
                    ></v-checkbox>
                    <v-checkbox
                      dense
                      style="padding: 0px !important; margin: 0px !important"
                      v-model="typeArr"
                      label="HT PCCC"
                      value="HT PCCC"
                    ></v-checkbox>
                    <v-checkbox
                      dense
                      style="padding: 0px !important; margin: 0px !important"
                      v-model="typeArr"
                      label="Thang máy"
                      value="Thang máy"
                    ></v-checkbox>
                    <v-checkbox
                      dense
                      style="padding: 0px !important; margin: 0px !important"
                      v-model="typeArr"
                      label="HT nước"
                      value="HT nước"
                    ></v-checkbox>
                  </v-col>
                  <v-col md="4">
                    <v-checkbox
                      dense
                      style="padding: 0px !important; margin: 0px !important"
                      v-model="typeArr"
                      label="HT Điện"
                      value="HT Điện"
                    ></v-checkbox>
                    <v-checkbox
                      dense
                      style="padding: 0px !important; margin: 0px !important"
                      v-model="typeArr"
                      label="HT điều áp"
                      value="HT điều áp"
                    ></v-checkbox>
                    <v-checkbox
                      dense
                      style="padding: 0px !important; margin: 0px !important"
                      v-model="typeArr"
                      label="Camera"
                      value="Camera"
                    ></v-checkbox>
                    <v-checkbox
                      dense
                      style="padding: 0px !important; margin: 0px !important"
                      v-model="typeArr"
                      label="Máy phát điện"
                      value="Máy phát điện"
                    ></v-checkbox>
                  </v-col>
                  <v-col md="4">
                    <v-checkbox
                      dense
                      style="padding: 0px !important; margin: 0px !important"
                      v-model="typeArr"
                      label="HT điện nhẹ"
                      value="HT điện nhẹ"
                    ></v-checkbox>
                    <v-checkbox
                      dense
                      style="padding: 0px !important; margin: 0px !important"
                      v-model="typeArr"
                      label="Chống sét"
                      value="Chống sét"
                    ></v-checkbox>
                    <v-checkbox
                      dense
                      style="padding: 0px !important; margin: 0px !important"
                      v-model="typeArr"
                      label="VS công nghiệp"
                      value="VS công nghiệp"
                    ></v-checkbox>
                    <v-checkbox
                      dense
                      style="padding: 0px !important; margin: 0px !important"
                      v-model="typeArr"
                      label="Cây xanh"
                      value="Cây xanh"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </fieldset>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="myButtonCustom" style="color:black !important" @click.stop="show=false">Đóng</v-btn>
        <v-btn color="success" class="myButtonCustom" @click="createTechnician">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    technician: {
      bucket: "crm_app_technician",
      content: {
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        address: "",
        type: "",
        roles: "technician",
        username: "",
        password: ""
      },
      createdByDevice: "facicare",
      creatingDate: "",
      description: "Đây là thông tin kỹ thuật viên được tạo từ CRM",
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

      this.technician.creatingDate = date + " " + time;
      this.technician.id = this.technician.content.phone_number;
      this.technician.content.type = this.typeArr.join(", ");

      return this.technician;
    },
    createTechnician: function() {
      // Check Authentication
      this.checkAuthentication();

      // call api create a new account
      let data = this.prepareSignupData();
      let serverDomain = this.$store.getters.getServerDomain;
      let authenBucket = this.$store.getters.getAuthenBucket;
      let api = "/api/core/v1/user/register/" + authenBucket;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      axios
        .post(url, data, config)
        .then(response => {
          if (response.data.code == "0") {
            // Tạo tài khoản thành công
            this.addTechnicianInfo();
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
            text: "Không thể tạo tài khoản đăng nhập cho KTV",
            type: "error",
            width: "400px"
          });
        });
    },
    addTechnicianInfo() {
      // Handle
      let data = this.prepareData();
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_technician";
      let record = this.technician.id;
      let api = "/api/core/v1/data/create" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      // call api create technician
      axios
        .post(url, data, config)
        .then(response => {
          // reset form
          this.technician.content = {
            first_name: "",
            last_name: "",
            phone_number: "",
            email: "",
            address: "",
            type: ""
          };
          this.typeArr = [];

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
    prepareSignupData() {
      this.technician.content.username = this.technician.content.phone_number;
      this.technician.content.password = this.generatePassword();
      return {
        username: this.technician.content.username,
        password: this.technician.content.password,
        roles: "technician",
        first_name: this.technician.content.first_name,
        last_name: this.technician.content.last_name,
        address: this.technician.content.address,
        phone_number: this.technician.content.phone_number,
        email: this.technician.content.email
      };
    },
    generatePassword() {
      var length = 8,
        charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
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