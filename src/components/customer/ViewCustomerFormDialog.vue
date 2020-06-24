<template>
  <v-dialog v-model="show" scrollable max-width="450px">
    <v-card>
      <v-card-title
        class="headline"
        style="background: #34495e; color: white"
      >Thông tin khách hàng</v-card-title>
      <v-card-text style="padding-bottom: 0px">
        <v-container grid-list-md>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Tên"
                v-model="customer.data_item.content.personalInfo.name"
                color="#7f8c8d"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Địa chỉ"
                v-model="customer.data_item.content.personalInfo.address"
                color="#7f8c8d"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Số điện thoại"
                v-model="customer.data_item.content.personalInfo.phone"
                color="#7f8c8d"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Email"
                v-model="customer.data_item.content.personalInfo.email"
                color="#7f8c8d"
                readonly
              ></v-text-field>
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
    customer: {
      get() {
        return this.$store.getters.getCustomer;
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