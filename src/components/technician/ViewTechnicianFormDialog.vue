<template>
  <v-dialog v-model="show" scrollable max-width="550px">
    <v-card>
      <v-card-title
        class="headline"
        style="background: #34495e; color: white"
      >Thông tin kỹ thuật viên</v-card-title>
      <v-card-text style="padding-bottom: 0px">
        <v-container grid-list-md>
          <v-row>
            <v-col class="removePaddingTopBottom" md="6">
              <v-text-field
                label="Tên"
                v-model="technician.data_item.content.first_name"
                color="#7f8c8d"
                readonly
              ></v-text-field>
            </v-col>
            <v-col class="removePaddingTopBottom" md="6">
              <v-text-field
                label="Họ"
                v-model="technician.data_item.content.last_name"
                color="#7f8c8d"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="6">
              <v-text-field
                label="Số điện thoại"
                v-model="technician.data_item.content.phone_number"
                color="#7f8c8d"
                readonly
              ></v-text-field>
            </v-col>
            <v-col class="removePaddingTopBottom" md="6">
              <v-text-field
                label="Email"
                v-model="technician.data_item.content.email"
                color="#7f8c8d"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Địa chỉ"
                v-model="technician.data_item.content.address"
                color="#7f8c8d"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Chuyên môn"
                v-model="technician.data_item.content.type"
                color="#7f8c8d"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="12" style="padding-top: 25px">
              <fieldset class="fieldset-info-box">
                <legend class="legend-info-box">Thông tin tài khoản đăng nhập</legend>
                <v-row class="input-group">
                  <v-col md="4" class="order-detail-label">Username:</v-col>
                  <v-col md="8">{{technician.data_item.content.username}}</v-col>
                </v-row>
                <v-row class="input-group">
                  <v-col md="4" class="order-detail-label">Mật khẩu:</v-col>
                  <v-col md="8">{{technician.data_item.content.password}}</v-col>
                </v-row>
              </fieldset>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          style="background: #34495e !important; color: white !important"
          @click.stop="show=false"
        >Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
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