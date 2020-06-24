<template>
  <v-dialog v-model="show" scrollable max-width="750px">
    <v-card>
      <v-card-title
        class="headline"
        style="background: #34495e; color: white"
        primary-title
      >Chi tiết đơn hàng</v-card-title>
      <v-card-text style="height: 400px;">
        <v-container grid-list-md>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field label="ID" v-model="order.record_id" readonly></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-text-field
                label="Các dịch vụ đã chọn"
                v-model="order.data_item.content.chosenServices"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Customer Info -->
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <fieldset class="scheduler-border">
                <legend class="scheduler-border">Thông tin khách hàng</legend>
                <v-row>
                  <v-col sm="3" style="text-align:right">ID:</v-col>
                  <v-col sm="9">
                    <span>{{order.data_item.content.customerInfo.id}}</span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="3" style="text-align:right">Tên:</v-col>
                  <v-col sm="9">
                    <span>{{order.data_item.content.customerInfo.name}}</span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="3" style="text-align:right">Số điện thoại:</v-col>
                  <v-col sm="9">
                    <span>{{order.data_item.content.customerInfo.phone}}</span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="3" style="text-align:right">Địa chỉ:</v-col>
                  <v-col sm="9">
                    <span>{{order.data_item.content.customerInfo.address}}</span>
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
/* Info box */
fieldset.scheduler-border {
  border: 1px groove #ddd !important;
  padding: 0 1em 1em 1em !important;
  margin: 0 0 1em 0 !important;
  -webkit-box-shadow: 0px 0px 0px 0px #444444;
  box-shadow: 0px 0px 0px 0px #444444;
}

legend.scheduler-border {
  font-size: 1.2em !important;
  font-weight: bold !important;
  text-align: left !important;
  width: auto;
  padding: 0 10px;
  border-bottom: none;
}
/* End Info Box */
</style>