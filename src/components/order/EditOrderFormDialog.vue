<template>
  <v-dialog v-model="show" max-width="700px">
    <v-card>
      <v-card-title style="background: #3498db; color: white">
        <span class="headline">Chỉnh sửa thông tin</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap style="max-height:350px;  overflow-y: scroll">
            <v-flex xs12>
              <v-text-field label="ID" v-model="order.data_item.id" disabled></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="ID khách hàng" v-model="order.data_item.customerID"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Tên khách hàng" v-model="order.data_item.customerName"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Số điện thoại" v-model="order.data_item.customerPhone" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Địa chỉ khách hàng"
                v-model="order.data_item.customerAddress"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Thời gian mong đợi"
                v-model="order.data_item.expectedTime"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="order.data_item.chosenServices"
                :items="services"
                multiple
                label="Dịch vụ"
                chips
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="order.data_item.status"
                :items="orderStates"
                label="Trạng thái đơn hàng"
                chips
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="myButtonCustom" style="color:black !important" @click.stop="show=false">Đóng</v-btn>
        <v-btn color="#3498db" class="myButtonCustom" @click="editOrder">Lưu</v-btn>
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
  data: () => {
    return {
      services: [
        "service01",
        "service02",
        "service03",
        "service04",
        "service05"
      ],
      orderStates: [
        "Chưa tiếp nhận - Chưa thanh toán",
        "Chưa tiếp nhận - Đã thanh toán",
        "Đã tiếp nhận - Chưa thanh toán",
        "Đã tiếp nhận - Đã thanh toán",
        "Đang xử lý - Chưa thanh toán",
        "Đang xử lý - Đã thanh toán",
        "Đã xử lý - Chưa thanh toán",
        "Đã xử lý - Đã thanh toán"
      ]
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
    },
    prepareData: function() {
      let data = {
        id: this.order.data_item.id,
        chosenServices: this.order.data_item.chosenServices,
        expectedTime: this.order.data_item.expectedTime,
        customerAddress: this.order.data_item.customerAddress,
        customerName: this.order.data_item.customerName,
        customerPhone: this.order.data_item.customerPhone,
        customerID: this.order.data_item.customerID,
        note: this.order.data_item.note,
        paymentType: this.order.data_item.paymentType,
        deviceID: this.order.data_item.deviceID,
        status: this.order.data_item.status
      };
      return data;
    }
  },
  methods: {
    editOrder: function() {
      // prepare data
      let data = this.prepareData;
      let bucket = "order";
      let record = this.order.record_id;
      let api = "http://221.132.29.81:1325/api/core/v1/update_many";
      let url = api + "/" + bucket + "/" + record;
      let config = {
        headers: {
          userid: "user1",
          deviceid: "sony_01",
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY1ODM0MzEsImlkIjoic29ueV8wMSJ9.mueI_rpIcJjOyNXw48hSSnxoXkWIz6ZaEtB9KgbxjDI"
        }
      };

      // call api edit order
      axios
        .patch(url, data, config)
        .then(response => {
          // notify to the screen
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
</style>