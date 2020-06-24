<template>
  <v-dialog v-model="show" scrollable max-width="450px">
    <v-card>
      <v-card-title class="headline" style="background: #3498db; color: white">Chỉnh sửa thông tin</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Tên"
                v-model="customer.data_item.content.personalInfo.name"
                color="#7f8c8d"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Địa chỉ"
                v-model="customer.data_item.content.personalInfo.address"
                color="#7f8c8d"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Email"
                v-model="customer.data_item.content.personalInfo.email"
                color="#7f8c8d"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-select
                :items="customerLevel"
                label="Cấp độ"
                v-model="customer.data_item.content.personalInfo.customerLevel"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="myButtonCustom" style="color:black !important" @click.stop="show=false">Đóng</v-btn>
        <v-btn color="info" class="myButtonCustom" @click="editRecord">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      customerLevel: ["Bình thường", "Thân thiết"]
    };
  },
  props: {
    value: Boolean
  },
  computed: {
    customer: {
      get() {
        let temp = this.$store.getters.getCustomer;
        let newJSON = JSON.parse(JSON.stringify(temp));
        if (newJSON.data_item.content.personalInfo.customerLevel == undefined) {
          newJSON.data_item.content.personalInfo.customerLevel = "Bình thường";
        }
        return newJSON;
      }
    },
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    prepareData: function() {
      return this.customer.data_item;
    }
  },
  methods: {
    checkAuthentication: function() {
      let isLoggedIn = this.$store.getters.loggedIn;
      if (!isLoggedIn) {
        this.$store.dispatch("startReLogin");
      }
    },
    editRecord: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let data = this.prepareData;
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_customer";
      let record = this.customer.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      // call api edit technician
      axios
        .patch(url, data, config)
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

          // reload table
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