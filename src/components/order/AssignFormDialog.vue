<template>
  <v-dialog v-model="show" scrollable max-width="650px">
    <v-card>
      <v-card-title
        class="headline"
        style="background: #34495e; color: white"
        primary-title
      >Phân công xử lý</v-card-title>
      <v-card-text style="height: 350px;">
        <v-container grid-list-md>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12">
              <v-select
                :items="technicians"
                label="Kỹ thuật viên"
                v-model="order.data_item.content.assignee"
              ></v-select>
            </v-col>
          </v-row>
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
          @click.stop="assign"
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
      technicians: []
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
      this.order.data_item.content.assigner = {
        id: "user1",
        name: "Nguyễn Tấn Lợi",
        phone: "0987654321"
      };
      this.order.data_item.content.status = "Đang xử lý";
      
      return this.order.data_item;
    },
    getTechnicianList: function() {
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_technician";
      let api = "/api/core/v1/data/all_in_bucket" + "/" + bucket;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      axios
        .get(url, config)
        .then(response => {
          if (response.data.data != null) {
            let data = response.data.data;
            for (let i = 0; i < data.length; i++) {
              let name = data[i].data_item.content.name;
              let phone = data[i].data_item.content.phoneNumber;
              let progressingTasks = data[i].data_item.content.progressingTasks;
              let technicianItem = name + " (Di động: " + phone + ")";
              this.technicians.push(technicianItem);
            }
          } else {
            this.technicians = [];
          }
        })
        .catch(e => {});
    },
    assign: function() {
      let data = this.prepareData();
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      // call api update assign info
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
  },
  created() {
    this.getTechnicianList();
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