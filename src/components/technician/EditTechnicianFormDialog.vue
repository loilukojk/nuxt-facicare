<template>
  <v-dialog v-model="show" scrollable max-width="550px">
    <v-card>
      <v-card-title class="headline" style="background: #3498db; color: white">Chỉnh sửa thông tin</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row>
            <v-col class="removePaddingTopBottom" md="6">
              <v-text-field
                label="Tên"
                v-model="technician.data_item.content.first_name"
                color="#7f8c8d"
              ></v-text-field>
            </v-col>
            <v-col class="removePaddingTopBottom" md="6">
              <v-text-field
                label="Họ"
                v-model="technician.data_item.content.last_name"
                color="#7f8c8d"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="6">
              <v-text-field
                label="Số điện thoại"
                v-model="technician.data_item.content.phone_number"
                color="#7f8c8d"
              ></v-text-field>
            </v-col>
            <v-col class="removePaddingTopBottom" md="6">
              <v-text-field
                label="Email"
                v-model="technician.data_item.content.email"
                color="#7f8c8d"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Địa chỉ"
                v-model="technician.data_item.content.address"
                color="#7f8c8d"
              ></v-text-field>
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
      typeArr: []
    };
  },
  props: {
    value: Boolean
  },
  computed: {
    technician: {
      get() {
        let technician = JSON.parse(
          JSON.stringify(this.$store.getters.getTechnician)
        );
        let temp = technician.data_item.content.type.split(", ");
        this.typeArr = temp;
        return technician;
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
      this.technician.data_item.content.type = this.typeArr.join(", ");
      return this.technician.data_item;
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
      let bucket = "crm_app_technician";
      let record = this.technician.record_id;
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