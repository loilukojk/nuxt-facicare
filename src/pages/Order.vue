<template>
  <v-row no-gutters>
    <!-- CRUD Order Dialogs -->
    <create-order-form-dialog v-model="showCreateOrderFormDialog" />
    <statistic-form-dialog v-model="showStatisticFormDialog" />

    <!-- Order table -->
    <v-col :cols="12">
      <v-card class="pa-2" tile outlined>
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="5"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Danh sách đơn hàng</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <div style="width: 300px">
                <v-select
                  v-model="search"
                  :items="orderStatusItems"
                  menu-props="auto"
                  label="Tất cả đơn hàng"
                  hide-details
                  single-line
                ></v-select>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                color="success"
                style="padding:2px 3px; margin: 0px 5px"
                outlined
                @click.stop="showStatisticFormDialog=true"
              >
                <v-icon style="margin-right: 4px">mdi-clipboard-text</v-icon>Thống kê
              </v-btn>
              <v-btn
                color="success"
                style="padding: 2px 3px; margin: 0px 2px"
                outlined
                min-width="35px"
                @click="createOrder(sampleOrder)"
              >
                <v-icon style="margin-right: 4px">mdi-playlist-plus</v-icon>Thêm mới đơn hàng
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.data_item.content.chosenServices="{ item }">
            <template>{{item.data_item.content.chosenServices | serviceFormat}}</template>
          </template>
          <template v-slot:item.data_item.content.customerInfo="{ item }">
            <v-row>
              <v-col md="4" class="text-right removePaddingTopBottom">Tên:</v-col>
              <v-col
                md="8"
                class="removePaddingTopBottom"
              >{{item.data_item.content.customerInfo.name}}</v-col>
            </v-row>
            <v-row>
              <v-col md="4" class="text-right removePaddingTopBottom">Số điện thoại:</v-col>
              <v-col
                md="8"
                class="removePaddingTopBottom"
              >{{item.data_item.content.customerInfo.phone}}</v-col>
            </v-row>
            <v-row>
              <v-col md="4" class="text-right removePaddingTopBottom">Địa chỉ:</v-col>
              <v-col
                md="8"
                class="removePaddingTopBottom"
              >{{item.data_item.content.customerInfo.address}}</v-col>
            </v-row>
          </template>
          <template v-slot:item.data_item.content.status="{ item }">
            <v-btn
              v-if="isNewStatus(item.data_item.content)"
              small
              rounded
              color="error"
            >{{item.data_item.content.status}}</v-btn>
            <v-btn v-else small rounded :style="statusColor(item)">{{item.data_item.content.status}}</v-btn>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              color="info"
              style="padding: 2px 3px; margin: 0px 2px"
              outlined
              title="Xem chi tiết đơn hàng"
              small
              @click="viewOrderDetail(item)"
            >
              <v-icon style="margin-right: 4px">mdi-library-books</v-icon>Xem chi tiết
            </v-btn>
          </template>
        </v-data-table>

        <!-- progress bar: "Đang lấy dữ liệu" -->
        <v-container
          v-show="isShowProgressBar"
          style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #3498db; width: 350px; height: 150px; color: white; border-radius: 20px; opacity: 0.95"
        >
          <v-row class="fill-height" align-content="center" justify="center">
            <v-col class="subtitle-1 text-center" cols="12" style="opacity: 1.0">Đang tải dữ liệu</v-col>
            <v-col cols="6">
              <v-progress-linear color="white" indeterminate rounded height="6"></v-progress-linear>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import CreateOrderFormDialog from "../components/order/CreateOrderFormDialog";
import StatisticFormDialog from "../components/order/StatisticFormDialog";
import MaterialCard from "../components/material/Card";

export default {
  data() {
    return {
      showCreateOrderFormDialog: false,
      showStatisticFormDialog: false,
      search: "",
      headers: [
        {
          sortable: false,
          text: "Ngày tạo",
          filterable: false,
          value: "data_item.creatingDate"
        },
        {
          sortable: false,
          text: "Loại dịch vụ",
          align: "left",
          filterable: false,
          value: "data_item.content.chosenServices"
        },
        {
          text: "Thông tin khác hàng",
          filterable: false,
          value: "data_item.content.customerInfo",
          sortable: false,
          align: "left",
          width: "350px"
        },
        {
          text: "Trạng thái",
          value: "data_item.content.status",
          sortable: true,
          filterable: true
        },
        {
          sortable: false,
          text: "Thao tác",
          filterable: false,
          value: "action",
          align: "center",
          width: "150px"
        }
      ],
      orderStatusItems: [
        "Tất cả đơn hàng",
        "Chưa tiếp nhận",
        "Đã phân công, chưa khảo sát",
        "Đã khảo sát, chưa báo giá",
        "Đã báo giá, chưa phản hồi",
        "Cần báo giá lại",
        "Phản hồi, cần edit",
        "Chưa gửi hợp đồng",
        "Đã gửi HĐ, chưa phản hồi",
        "Đã chốt, chưa phân công",
        "Chưa xong việc, chưa thanh toán",
        "Chưa xong việc, đã thanh toán",
        "Hoàn tất công việc, chưa thanh toán",
        "Hoàn tất công việc, đã thanh toán",
        "Đã hủy",
        "Pending"
      ],
      orderHandles: [],
      //items: [], ==> chuyển sang sử dụng computed để nhận trigger sự kiện giá trị thay đổi từ state của vuex
      errors: [],
      sampleOrder: {
        data_item: {
          bucket: "crm_app_order",
          content: {
            assignInfo: {
              assignDate: "",
              assignee: {
                avatar: "",
                id: "",
                name: "",
                phone: "",
                workDate: "",
                deadline: ""
              },
              assigner: {
                id: "",
                name: "",
                phone: ""
              }
            },
            chosenServices: [],
            customerInfo: {
              address: "",
              id: "",
              name: "",
              phone: ""
            },
            deviceid: "",
            expectedAddress: "",
            expectedTime: "",
            id: "",
            imageList: [],
            note: "",
            orderValue: {
              details: [],
              sum: ""
            },
            paymentInfo: {
              invoice: {},
              paymentDate: "",
              paymentMethod: "",
              status: ""
            },
            status: "",
            videoList: "",
            hasContract: "",
            quoteTime: ""
          },
          createdByDevice: "",
          creatingDate: "",
          description: "",
          id: ""
        },
        record_id: ""
      },
      isShowProgressBar: false
    };
  },
  watch: {
    search: function(val) {
      if (val == "Tất cả đơn hàng") {
        this.search = "";
      }
    }
  },
  computed: {
    items() {
      return this.$store.getters.orderList;
    }
  },
  components: {
    CreateOrderFormDialog,
    StatisticFormDialog,
    MaterialCard
  },
  filters: {
    serviceFormat: function(value) {
      if (!value) return "";
      let result = "";
      for (let i = 0; i < value.length - 1; i++) {
        result += value[i] + ", ";
      }
      result += value[value.length - 1];
      return result;
    }
  },
  methods: {
    checkAuthentication: function() {
      let isLoggedIn = this.$store.getters.loggedIn;
      if (!isLoggedIn) {
        this.$store.dispatch("startReLogin");
      }
    },
    viewOrderInfo: function(order) {
      this.showViewOrderFormDialog = true;
      this.$store.dispatch("setOrder", order);
    },
    editOrderInfo: function(order) {
      this.showEditOrderFormDialog = true;
      this.$store.dispatch("setOrder", order);
    },
    deleteOrderInfo: function(order) {
      this.showDeleteOrderFormDialog = true;
      this.$store.dispatch("setOrder", order);
    },
    getTempPayment: function(item) {
      let payment = {
        status: "0",
        type: "Cash",
        description: "Chưa thanh toán",
        value: "",
        datetime: ""
      };
      return payment;
    },
    fncAssign: function(item) {
      // show dialog
      this.showAssignFormDialog = true;
      this.$store.dispatch("setOrder", item);
    },
    fncUpdateOrderStatus: function(item) {
      // show dialog
      this.showUpdateOrderStatusFormDialog = true;
      this.$store.dispatch("setOrder", item);
    },
    fncMoveToSpamOrder: function(item) {
      this.showMoveToSpamOrderFormDialog = true;
      this.$store.dispatch("setOrder", item);
    },
    isNewStatus: function(content) {
      if (typeof content.status === "undefined") {
        content.status = "Chưa tiếp nhận";
        return true;
      }
      return false;
    },
    statusColor: function(item) {
      let orderStatus = item.data_item.content.status;
      switch (orderStatus) {
        case "0":
        case "Chưa tiếp nhận":
          item.data_item.content.status = "Chưa tiếp nhận";
          return "background: #ff5252; color: white; cursor: default";

        case "0a":
        case "Đã phân công, chưa khảo sát":
          item.data_item.content.status = "Đã phân công, chưa khảo sát";
          return "background: #e67e22; color: white; cursor: default";

        case "0b":
        case "Đã khảo sát, chưa báo giá":
          item.data_item.content.status = "Đã khảo sát, chưa báo giá";
          return "background: #e67e22; color: white; cursor: default";

        case "1":
        case "Đã báo giá, chưa phản hồi":
          item.data_item.content.status = "Đã báo giá, chưa phản hồi";
          return "background: #e67e22; color: white; cursor: default";

        case "1a":
        case "Cần báo giá lại":
          item.data_item.content.status = "Cần báo giá lại";
          return "background: #e67e22; color: white; cursor: default";

        case "2":
        case "Phản hồi, cần edit":
          item.data_item.content.status = "Phản hồi, cần edit";
          return "background: #f1c40f; color: white; cursor: default";

        case "2a":
        case "Chưa gửi hợp đồng":
          item.data_item.content.status = "Chưa gửi hợp đồng";
          return "background: #e74c3c; color: white; cursor: default";

        case "2b":
        case "Đã gửi HĐ, chưa phản hồi":
          item.data_item.content.status = "Đã gửi HĐ, chưa phản hồi";
          return "background: #f39c12; color: white; cursor: default";

        case "3":
        case "Chưa xong việc, chưa thanh toán":
          if (item.data_item.content.assignInfo.assigneeIDList.length > 0) {
            item.data_item.content.status = "Chưa xong việc, chưa thanh toán";
            return "background: #3498db; color: white; cursor: default";
          } else {
            item.data_item.content.status = "Đã chốt, chưa phân công";
            return "background: #9b59b6; color: white; cursor: default";
          }

        case "6":
        case "Chưa xong việc, đã thanh toán":
          if (item.data_item.content.assignInfo.assigneeIDList.length > 0) {
            item.data_item.content.status = "Chưa xong việc, đã thanh toán";
            return "background: #3498db; color: white; cursor: default";
          } else {
            item.data_item.content.status = "Đã chốt, chưa phân công";
            return "background: #9b59b6; color: white; cursor: default";
          }

        case "4":
        case "Hoàn tất công việc, chưa thanh toán":
          item.data_item.content.status = "Hoàn tất công việc, chưa thanh toán";
          return "background: #3498db; color: white; cursor: default";

        case "5":
        case "Hoàn tất công việc, đã thanh toán":
          item.data_item.content.status = "Hoàn tất công việc, đã thanh toán";
          return "background: #27ae60; color: white; cursor: default";

        case "7":
        case "Đã hủy":
          item.data_item.content.status = "Đã hủy";
          return "background: #95a5a6; color: white; cursor: default";

        case "8":
        case "Pending":
          item.data_item.content.status = "Pending";
          return "background: #34495e; color: white; cursor: default";

        case "2c":
        case "Đã chốt, chưa phân công":
          item.data_item.content.status = "Đã chốt, chưa phân công";
          return "background: #9b59b6; color: white; cursor: default";

        default:
          return "#b2bec3";
      }
    },
    createOrder: function(item) {
      // isCreateNew
      this.$store.dispatch("setIsCreateNew", true);

      // store item to vuex
      this.$store.dispatch("setOrder", item);

      // move to order detail page
      let orderid = "create-new";
      let path = "/facicare/order-detail" + "/" + orderid;
      this.$router.push({ path: path }).catch(() => {});
    },
    viewOrderDetail: function(item) {
      // store item to vuex
      this.$store.dispatch("setOrder", item);

      // move to order detail page
      let orderid = item.record_id;
      let path = "/facicare/order-detail" + "/" + orderid;
      this.$router.push({ path: path }).catch(() => {});
    }
  },
  created() {
    // show progress bar before get data from DB
    this.isShowProgressBar = true;

    // Get data from DB
    this.$store.dispatch("setPageTitle", "Đơn hàng");
    this.$store.dispatch("getOrderList").then(res => {
      // hide progress bar after get data from DB
      this.isShowProgressBar = false;
    });
  }
};
</script>

<style>
.removePadding {
  padding: 0px !important;
}
.removePaddingTopBottom {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
i.v-icon.mdi.mdi-chevron-right.theme--light {
  color: #999 !important;
}
i.v-icon.mdi.mdi-chevron-left.theme--light {
  color: #999 !important;
}
.listItemTitle {
  cursor: pointer;
}
</style>