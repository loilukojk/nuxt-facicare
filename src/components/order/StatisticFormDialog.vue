<template>
  <v-dialog v-model="show" scrollable max-width="350px">
    <v-card>
      <v-card-title style="background: #3498db; color: white">Thống kê tổng số đơn hàng</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row>
            <v-col cols="12" md="12" style="padding-top: 0px; padding-bottom: 0px">
              <v-radio-group v-model="statisticType">
                <v-radio label="Theo ngày" color="blue" value="dayType"></v-radio>
                <v-radio label="Theo tuần" color="blue" value="weekType"></v-radio>
                <v-radio label="Theo tháng" color="blue" value="monthType"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row v-show="showDayType">
            <v-col cols="12" md="12">
              <v-menu
                ref="menuDate"
                v-model="menuDate"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateFormatted"
                    label="Ngày"
                    hint="DD/MM/YYYY"
                    persistent-hint
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title @input="menuDate = false"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row v-show="showWeekType">
            <v-col cols="6" lg="6">
              <v-menu
                ref="menuFromDate"
                v-model="menuFromDate"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="fromDateFormatted"
                    label="Từ ngày"
                    hint="DD/MM/YYYY"
                    persistent-hint
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="fromDate" no-title @input="menuFromDate = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6" lg="6">
              <v-menu
                ref="menuToDate"
                v-model="menuToDate"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="toDateFormatted"
                    label="Đến ngày"
                    hint="DD/MM/YYYY"
                    persistent-hint
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="toDate" no-title @input="menuToDate = false"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row v-show="showMonthType">
            <v-col cols="12" md="12">
              <v-menu
                ref="menuMonth"
                v-model="menuMonth"
                :close-on-content-click="false"
                :return-value.sync="month"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="monthFormatted"
                    label="Tháng"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="month" type="month" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menuMonth = false">Thoát</v-btn>
                  <v-btn text color="primary" @click="$refs.menuMonth.save(month)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          style="background: #3498db !important; color: white !important"
          @click="downloadExcel"
        >Tải xuống</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import exportFromJSON from "export-from-json";

export default {
  data(vm) {
    return {
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      fromDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      toDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      monthFormatted: vm.formatMonth(new Date().toISOString().substr(0, 7)),
      menuDate: false,
      menuFromDate: false,
      menuToDate: false,
      menuMonth: false,
      date: new Date().toISOString().substr(0, 10),
      fromDate: new Date().toISOString().substr(0, 10),
      toDate: new Date().toISOString().substr(0, 10),
      month: new Date().toISOString().substr(0, 7),
      statisticType: "dayType",
      showDayType: true,
      showWeekType: false,
      showMonthType: false
    };
  },
  props: {
    value: Boolean
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
    fromDate(val) {
      this.fromDateFormatted = this.formatDate(this.fromDate);
      this.toDate = this.add6Days(this.fromDate);
    },
    toDate(val) {
      this.toDateFormatted = this.formatDate(this.toDate);
      this.fromDate = this.sub6Days(this.toDate);
    },
    month(val) {
      this.monthFormatted = this.formatMonth(this.month);
    },
    statisticType(val) {
      if (val == "dayType") {
        this.showDayType = true;
        this.showWeekType = false;
        this.showMonthType = false;
      } else if (val == "weekType") {
        this.showDayType = false;
        this.showWeekType = true;
        this.showMonthType = false;
      } else {
        this.showDayType = false;
        this.showWeekType = false;
        this.showMonthType = true;
      }
    }
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
    add6Days: function(date) {
      var result = new Date(date);
      result.setDate(result.getDate() + 6);
      return this.formatDateTime(result);
    },
    sub6Days: function(date) {
      var result = new Date(date);
      result.setDate(result.getDate() - 6);
      return this.formatDateTime(result);
    },
    validateData: function() {
      const [fyear, fmonth, fday] = this.fromDate.split("-");
      const [tyear, tmonth, tday] = this.toDate.split("-");
      if (fyear > tyear) {
        return false;
      } else if (fmonth > tmonth) {
        return false;
      } else if (fday > tday) {
        return false;
      } else {
        return true;
      }
    },
    downloadExcel: function() {
      if (this.validateData()) {
        // get statistic
        // somecode here
      } else {
        this.$notify({
          group: "notifications",
          title: "HỆ THỐNG",
          text: "Thông tin nhập vào không hợp lệ",
          duration: 5000,
          type: "warning",
          width: "400px"
        });
      }
    },
    formatMonth(valMonth) {
      if (!valMonth) return null;

      const [year, month] = valMonth.split("-");
      return `${month}/${year}`;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    fetchData() {
      return new Promise((resolve, reject) => {
        if (this.statisticType == "dayType") {
          this.getStatisticByDay()
            .then(res => {
              let resData = res.data;
              if (resData.code != "1") {
                resolve(resData);
              } else {
                resolve([]);
              }
            })
            .catch(err => {
              resolve([]);
            });
        } else if (this.statisticType == "weekType") {
          this.getStatisticByWeek()
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              resolve([]);
            });
        } else {
          this.getStatisticByMonth()
            .then(res => {
              let resData = res.data;
              if (resData.code != "1") {
                resolve(resData);
              } else {
                resolve([]);
              }
            })
            .catch(err => {
              resolve([]);
            });
        }
      });
    },
    getStatisticByDay: function() {
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let api = "/api/core/v1/data/all_in_bucket/match/" + bucket;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      let data = {
        creatingDate: this.dateFormatted
      };
      return axios.post(url, data, config);
    },
    getStatisticByWeek: function() {
      return new Promise(async (resolve, reject) => {
        let result = [];

        let day = this.fromDate;

        for (let i = 0; i < 7; i++) {
          let serverDomain = this.$store.getters.getServerDomain;
          let bucket = "crm_app_order";
          let api = "/api/core/v1/data/all_in_bucket/match/" + bucket;
          let url = serverDomain + api;
          let config = {
            headers: this.$store.getters.getAuthConfig
          };
          let data = {
            creatingDate: this.formatDate(day)
          };

          await axios
            .post(url, data, config)
            .then(res => {
              let resData = res.data;
              if (resData.code != "1") {
                for (let j = 0; j < resData.length; j++) {
                  result.push(resData[j]);
                }
              }
            })
            .catch(err => {});

          // add a day
          var tempDate = new Date(day);
          tempDate.setDate(tempDate.getDate() + 1);
          day = this.formatDateTime(tempDate);
        }

        resolve(result);
      });
    },
    getStatisticByMonth: function() {
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let api = "/api/core/v1/data/all_in_bucket/match/" + bucket;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      let data = {
        creatingDate: this.monthFormatted
      };
      return axios.post(url, data, config);
    },
    async downloadExcel() {
      // const raw_data = [{ foo: "vfoo - Lợi", bar: "vbar - Nguyễn" },{ foo: "ajhsgdjh", bar: "vbar1 - Cỏ" }];
      const raw_data = await this.fetchData();
      const data = this.dataFormatted(raw_data);
      const fileName = this.getStatisticFileName();
      const exportType = "csv";
      if (data.length > 0) {
        exportFromJSON({ data, fileName, exportType });
      } else {
        this.$notify({
          group: "notifications",
          title: "HỆ THỐNG",
          text: "Không có đơn hàng trong khoảng thời gian này",
          duration: 5000,
          type: "warning",
          width: "400px"
        });
      }
    },
    getStatisticFileName: function() {
      if (this.showDayType) {
        return "ThongKe_" + this.dateFormatted;
      } else if (this.showWeekType) {
        return "ThongKe_" + this.fromDateFormatted + "_" + this.toDateFormatted;
      } else {
        return "ThongKe_" + this.monthFormatted;
      }
    },
    dataFormatted: function(data) {
      let result = [];
      for (let i = 0; i < data.length; i++) {
        let temp = {};
        let content = data[i].content;

        temp["STT"] = i + 1;
        temp["ID"] = data[i].id;
        temp["Ngày tạo"] = data[i].creatingDate;
        temp["Thông tin khách hàng"] = this.getCustomerInfo(
          content.customerInfo
        );
        temp["Người liên hệ trực tiếp"] = this.getCustomerDirectContact(
          content.customerDirectContact
        );
        temp["Địa chỉ yêu cầu"] = content.expectedAddress;
        temp["Thời gian yêu cầu"] = content.expectedTime;
        temp["Hợp đồng"] = this.getHasContract(content.hasContract);
        temp["Nội dung công việc"] = content.note;
        temp["Chi phí dịch vụ"] = this.getOrderValue(content.orderValue);
        temp["Thông tin thanh toán"] = this.getPaymentInfo(content.paymentInfo);
        temp["Thông tin phân công"] = this.getAssignInfo(content.assignInfo);
        temp["Thông tin KTV khảo sát"] = this.getSurveyByTechnicianInfo(
          content.surveyByTechnicianInfo
        );
        temp["Trạng thái đơn hàng"] = this.getStatus(
          content.status,
          content.assignInfo.assigneeIDList.length
        );
        result.push(temp);
      }
      return result;
    },
    getAssignInfo: function(json) {
      if (!json) {
        return "";
      } else if (!json.assignDate) {
        return "Chưa có";
      } else {
        let temp = "Ngày phân công: " + json.assignDate;
        temp +=
          "\n" +
          "Người phân công: " +
          json.assigner.name +
          " - Số điện thoại: " +
          json.assigner.phone;
        temp += "\n" + "Ngày bắt đầu: " + json.workDate;
        temp += "\n" + "Thời hạn: " + json.deadline;
        temp += "\n" + "Danh sách KTV: " + this.getAssigneeList(json.assignee);
        return temp;
      }
    },
    getAssigneeList: function(arr) {
      if (!arr) {
        return "";
      } else {
        let result = "";
        for (let i = 0; i < arr.length; i++) {
          let temp = arr[i].name + " (" + arr[i].phone;
          if (arr[i].isTeamLeader) {
            temp += ", nhóm trưởng)";
          } else {
            temp += ")";
          }
          result += temp;
          if (i < arr.length - 1) {
            result += ", ";
          }
        }
        return result;
      }
    },
    getCustomerDirectContact: function(json) {
      if (!json) {
        return "";
      } else {
        let temp = "Tên: " + json.name;
        temp += "\n" + "Số điện thoại: " + json.phone;
        temp += "\n" + "Địa chỉ: " + json.address;
        return temp;
      }
    },
    getCustomerInfo: function(json) {
      if (!json) {
        return "";
      } else {
        let temp = "Tên: " + json.name;
        temp += "\n" + "Số điện thoại: " + json.phone;
        temp += "\n" + "Địa chỉ: " + json.address;
        return temp;
      }
    },
    getHasContract: function(val) {
      if (!val) {
        return "Không";
      } else if (val == "0") {
        return "Không";
      } else {
        return "Có";
      }
    },
    getOrderValue: function(json) {
      if (!json) {
        return "";
      } else if (!json.sum){
        return "Chưa có"
      }
      else {
        let details = json.details;
        let temp = "Tổng giá trị: " + json.sum;
        for (let i = 0; i < details.length; i++) {
          temp +=
            "\n Dịch vụ: " +
            details[i].name +
            " - Chi phí: " +
            details[i].charge;
        }
        return temp;
      }
    },
    getPaymentInfo: function(json) {
      if (!json) {
        return "";
      } else {
        if (json.status == "0") {
          return "Chưa thanh toán";
        } else {
          let temp = "";
          if (json.paymentMethod == "0") {
            temp += "Ngày thanh toán: " + json.paymentDate;
            temp += "\nHình thức: Tiền mặt";
            temp += "\nInvoice: " + JSON.stringify(json.invoice);
          } else {
            temp += "Ngày thanh toán: " + json.paymentDate;
            temp += "\nHình thức: Thẻ";
            temp += "\nInvoice: " + JSON.stringify(json.invoice);
          }
          return temp;
        }
      }
    },
    getStatus: function(val, numberOfTechnician) {
      switch (val) {
        case "0":
          return "Chưa tiếp nhận";

        case "0a":
          return "Đã phân công, chưa khảo sát";

        case "0b":
          return "Đã khảo sát, chưa báo giá";

        case "1":
          return "Đã báo giá, chưa phản hồi";

        case "1a":
          return "Cần báo giá lại";

        case "2":
          return "Phản hồi, cần edit";

        case "2a":
          return "Chưa gửi hợp đồng";

        case "2b":
          return "Đã gửi HĐ, chưa phản hồi";

        case "3":
          if (numberOfTechnician > 0) {
            return "Chưa xong việc, chưa thanh toán";
          } else {
            return "Đã chốt, chưa phân công";
          }

        case "6":
          if (numberOfTechnician > 0) {
            return "Chưa xong việc, đã thanh toán";
          } else {
            return "Đã chốt, chưa phân công";
          }

        case "4":
          return "Hoàn tất công việc, chưa thanh toán";

        case "5":
          return "Hoàn tất công việc, đã thanh toán";

        case "7":
          return "Đã hủy";

        case "8":
          return "Pending";

        case "2c":
          return "Đã chốt, chưa phân công";
        default:
          return "";
      }
    },
    getSurveyByTechnicianInfo: function(json) {
      if (!json) {
        return "";
      } else if (!json.workDate) {
        return "Chưa có";
      } else {
        let temp =
          "KTV: " + json.assignee.name + " - SĐT: " + json.assignee.phone;
        temp += "\n" + "Ngày bắt đầu: " + json.workDate;
        temp += "\n" + "Thời hạn: " + json.deadline;
        return temp;
      }
    },
    getMonthDateTimeValue: function(month) {
      switch (month) {
        case "Jan":
          return "01";
        case "Feb":
          return "02";
        case "Mar":
          return "03";
        case "Apr":
          return "04";
        case "May":
          return "05";
        case "Jun":
          return "06";
        case "Jul":
          return "07";
        case "Aug":
          return "08";
        case "Sep":
          return "09";
        case "Oct":
          return "10";
        case "Nov":
          return "11";
        case "Dec":
          return "12";
        default:
          return "00";
      }
    },
    formatDateTime: function(datetimeValue) {
      // datetimeValue is an object, so we need to convert it to a string to deal with it
      datetimeValue = datetimeValue + "";

      // datetimeValue look like the string below:
      // "Thu Mar 05 2020 14:00:00 GMT+0700 (Indochina Time)"
      let result = "";
      let arr = datetimeValue.split(" ");

      result += arr[3] + "-"; // year
      result += this.getMonthDateTimeValue(arr[1]) + "-"; // month
      result += arr[2]; // day
      return result;
    }
  },
  created() {
    // setup
    this.fromDate = this.sub6Days(this.toDate);
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