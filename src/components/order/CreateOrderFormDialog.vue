<template>
  <v-dialog v-model="show" scrollable max-width="500px">
    <v-card>
      <v-card-title
        class="headline"
        style="background: #2ecc71; color: white"
        primary-title
      >Thêm mới đơn hàng</v-card-title>
      <v-card-text style="height: 400px;">
        <v-container grid-list-md>
          <v-row>
            <v-col class="removePaddingTopBottom" cols="12" md="12">
              <v-text-field label="ID" v-model="order.id" required></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" cols="12" md="12">
              <v-text-field label="Loại dịch vụ" v-model="order.chosenServices"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" cols="12" md="12">
              <v-text-field label="Thời gian mong muốn" v-model="order.expectedTime" required></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" cols="12" md="12">
              <v-text-field label="Ghi chú" v-model="order.note" required></v-text-field>
            </v-col>
          </v-row>
          <!-- Thông tin khách hàng có 2 options: đã có tài khoản & chưa có tài khoản -->
          <v-row>
            <v-col class="removePaddingTopBottom" cols="12" md="12">
              <v-text-field label="ID khách hàng" v-model="order.customerID"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" cols="12" md="12">
              <v-text-field label="Tên, số điện thoại, địa chỉ" v-model="order.newCustomer"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" cols="12" sm="12" md="12">
              <label for="service">Dịch vụ</label>
            </v-col>
            <v-col class="removePaddingTopBottom" cols="12" sm="4" md="4">
              <v-checkbox v-model="order.chosenServices" label="service" color="orange" value="service" hide-details></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="myButtonCustom" style="color:black !important" @click.stop="show=false">Đóng</v-btn>
        <v-btn color="#2ecc71" style="color:white" class="myButtonCustom" @click="createOrder">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    order: {
      id: "",
      creatingDate: "",
      chosenServices: [],
      expectedTime: "",
      note: "",
      customerInfo: {
        id: "",
        name: "",
        phone: "",
        address: ""
      }
    }
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
    getCurrentDateTime: function() {
      let today = new Date();
      let hours = today.getHours();
      let minutes = today.getMinutes();
      let seconds = today.getSeconds();
      let years = today.getFullYear();
      let months = today.getMonth() + 1;
      let days = today.getDate();

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (months < 10) {
        months = "0" + months;
      }
      if (days < 10) {
        days = "0" + days;
      }

      let time = hours + ":" + minutes + ":" + seconds;
      let date = years + "/" + months + "/" + days;
      let result = date + " " + time;

      return result;
    },
    prepareData: function() {
      this.order.creatingDate = this.getCurrentDateTime();
      this.order.customerInfo = {
        id: "customer01",
        name: "Nguyễn Tấn Lợi",
        phone: "0123456789",
        address: "KTX Khu A, KTX ĐHQG-HCM"
      };
      return this.order;
    },
    createOrder: function() {
      // prepare data
      let data = this.prepareData();
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.content.id;
      let api = "/api/core/v1/data/create" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      // call api create device
      axios
        .post(url, data, config)
        .then(response => {
          // reset form
          this.order = {
            id: "",
            creatingDate: "",
            chosenServices: [],
            expectedTime: "",
            note: "",
            customerInfo: {
              id: "",
              name: "",
              phone: "",
              address: ""
            }
          };

          // close form & notify to the screen
          this.show = false;
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Thao tác đã được thực hiện!",
            type: "success",
            width: "400px"
          });
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
.removePaddingTopBottom {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
</style>