<template>
  <v-dialog v-model="show" scrollable max-width="650px">
    <v-card>
      <v-card-title
        class="headline"
        style="background: #34495e; color: white"
        primary-title
      >Cập nhật trạng thái đơn hàng</v-card-title>
      <v-card-text style="height: 350px;">
        <v-container grid-list-md>
          <!-- Order Info -->
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <fieldset class="scheduler-border">
                <legend class="scheduler-border">Thông tin đơn hàng</legend>
                <v-row>
                  <v-col sm="3" style="text-align:right">ID:</v-col>
                  <v-col sm="9">
                    <span>{{order.record_id}}</span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="3" style="text-align:right">Ngày tạo:</v-col>
                  <v-col sm="9">
                    <span>{{order.data_item.content.creatingDate}}</span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="3" style="text-align:right">Ngày mong muốn:</v-col>
                  <v-col sm="9">
                    <span>{{order.data_item.content.expectedTime}}</span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="3" style="text-align:right">Các dịch vụ:</v-col>
                  <v-col sm="9">
                    <span>{{order.data_item.content.chosenServices}}</span>
                  </v-col>
                </v-row>
              </fieldset>
            </v-col>
          </v-row>

          <!-- Update Info -->
          <v-row>
            <v-col md="6">
              <v-radio-group label="Trạng thái xử lý" v-model="order.data_item.content.status">
                <v-radio label="Đã tiếp nhận" color="warning" value="Đã tiếp nhận"></v-radio>
                <v-radio label="Đang xử lý" color="info" value="Đang xử lý"></v-radio>
                <v-radio label="Đã xử lý" color="success" value="Đã xử lý"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col md="6">
              <v-radio-group
                label="Trạng thái thanh toán"
                v-model="order.data_item.content.payment.description"
              >
                <v-radio label="Chưa thanh toán" color="error" value="Chưa thanh toán"></v-radio>
                <v-radio label="Đã thanh toán" color="success" value="Đã thanh toán"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          style="background: #ecf0f1 !important; color: black !important"
          @click.stop="show=false"
        >Đóng</v-btn>
        <v-btn
          style="background: #34495e !important; color: white !important"
          @click.stop="updateOrderStatus"
        >Thực hiện</v-btn>
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
  data() {
    return {
      technicians: [],
      paymentStatusList: ["Chưa thanh toán", "Đã thanh toán"],
      handleStatusList: ["Đã tiếp nhận", "Đang xử lý", "Đã xử lý"]
    };
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
    prepareData: function() {
      return this.order.data_item;
    },
    updateOrderStatus: function() {
      let data = this.prepareData();
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      // call api update update info
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