<template>
  <v-container class="grey lighten-5">
    <v-row dense>
      <v-col style="border: 1px solid #bdc3c7">
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn outlined class="mr-4" @click="setToday">Hôm nay</v-btn>
            <v-btn fab text small @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="700">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="statistics"
            :event-color="getEventColor"
            :event-margin-bottom="3"
            :now="today"
            :type="type"
            @change="updateRange"
          ></v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    today: "2019-11-01",
    focus: "2019-12-01",
    type: "month",
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    statistics: [],
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear()
  }),
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      let startMonth = this.monthFormatter(start);
      // const endMonth = this.monthFormatter(end);
      // const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      // const endYear = end.year;
      // const suffixYear = startYear === endYear ? "" : endYear;

      // const startDay = start.day + this.nth(start.day);
      // const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          startMonth = this.changeMonthsTextToVietnamese(startMonth);
          return `${startMonth}, ${startYear}`;
        // case "week":
        // case "4day":
        //   return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        // case "day":
        //   return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },
  created() {
    this.$store.dispatch("setPageTitle", "Trang chính");
    this.getStatistics(this.currentMonth, this.currentYear);
  },
  mounted() {
    this.$refs.calendar.checkChange();
    this.today = this.getToday();
    this.focus = this.today;

    // change Days Text to Vietnamese
    let days = document.getElementsByClassName("v-calendar-weekly__head");
    days[0].innerHTML = `
      <div class="v-calendar-weekly__head-weekday v-present primary--text">Chủ nhật</div>
      <div class="v-calendar-weekly__head-weekday v-present primary--text">Thứ 2</div>
      <div class="v-calendar-weekly__head-weekday v-present primary--text">Thứ 3</div>
      <div class="v-calendar-weekly__head-weekday v-present primary--text">Thứ 4</div>
      <div class="v-calendar-weekly__head-weekday v-present primary--text">Thứ 5</div>
      <div class="v-calendar-weekly__head-weekday v-present primary--text">Thứ 6</div>
      <div class="v-calendar-weekly__head-weekday v-present primary--text">Thứ 7</div>`;

    // change the string in the first day & next month first day to Vietnamese
    this.changeTextFirstDayOfMonthToVietNamese();
  },
  updated() {
    // change the string in the first day & next month first day to Vietnamese
    this.changeTextFirstDayOfMonthToVietNamese();
  },
  methods: {
    checkAuthentication: function() {
      let isLoggedIn = this.$store.getters.loggedIn;
      if (!isLoggedIn) {
        this.$store.dispatch("startReLogin");
      }
    },
    getStatistics(currentMonth, currentYear) {
      // Check Authentication
      this.checkAuthentication();

      // reset statistics
      this.statistics = [];

      // call api get all order in current month
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let api = "/api/core/v1/data/all_in_bucket/match/" + bucket;
      let url = serverDomain + api;
      let today = new Date();
      let month = currentMonth;
      let year = currentYear;
      let data = {
        creatingDate: month + "/" + year
      };
      if (data.creatingDate.length == 6) {
        data.creatingDate = "0" + data.creatingDate;
      }
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      axios
        .post(url, data, config)
        .then(res => {
          if (res.data.code != "1") {
            // setup
            let tempArr = {};
            for (let i = 1; i <= 31; i++) {
              let day = i;
              let year_month_day = year + "-" + month + "-" + day;
              let item1 = {
                name: 0,
                start: year_month_day,
                end: year_month_day,
                color: "grey darken-1"
              };
              let item2 = {
                name: 0,
                start: year_month_day,
                end: year_month_day,
                color: "blue"
              };
              let item3 = {
                name: 0,
                start: year_month_day,
                end: year_month_day,
                color: "green"
              };

              tempArr[year_month_day] = {
                tiepnhan: item1,
                dangxuly: item2,
                dahoanthanh: item3
              };
            }

            // set real value from database
            let resData = res.data;
            for (let i = 0; i < resData.length; i++) {
              let creatingDate = resData[i].creatingDate.split(" ");
              let orderDate = creatingDate[0].split("/");
              let month = parseInt(orderDate[1]);
              let day = parseInt(orderDate[0]);
              let year_month_day = orderDate[2] + "-" + month + "-" + day;
              let status = resData[i].content.status;
              switch (status) {
                case "3":
                case "4":
                case "6": {
                  // case dang xu ly
                  tempArr[year_month_day].tiepnhan.name += 1;
                  tempArr[year_month_day].dangxuly.name += 1;
                  break;
                }
                case "5": {
                  // case hoan tat
                  tempArr[year_month_day].tiepnhan.name += 1;
                  tempArr[year_month_day].dahoanthanh.name += 1;
                  break;
                }
                default: {
                  break;
                }
              }
            }

            // set to statistics array
            let month1 = currentMonth;
            let year1 = currentYear;
            for (let i = 1; i <= 31; i++) {
              let year_month_day = year1 + "-" + month1 + "-" + i;
              tempArr[year_month_day].tiepnhan.name =
                "Tiếp nhận: " + tempArr[year_month_day].tiepnhan.name;
              tempArr[year_month_day].dangxuly.name =
                "Đang xử lý: " + tempArr[year_month_day].dangxuly.name;
              tempArr[year_month_day].dahoanthanh.name =
                "Đã hoàn thành: " + tempArr[year_month_day].dahoanthanh.name;
              this.statistics.push(tempArr[year_month_day].tiepnhan);
              this.statistics.push(tempArr[year_month_day].dangxuly);
              this.statistics.push(tempArr[year_month_day].dahoanthanh);
            }
          } else {
            // setup
            let tempArr = {};
            for (let i = 1; i <= 31; i++) {
              let day = i;
              let year_month_day = year + "-" + month + "-" + day;
              let item1 = {
                name: 0,
                start: year_month_day,
                end: year_month_day,
                color: "grey darken-1"
              };
              let item2 = {
                name: 0,
                start: year_month_day,
                end: year_month_day,
                color: "blue"
              };
              let item3 = {
                name: 0,
                start: year_month_day,
                end: year_month_day,
                color: "green"
              };

              tempArr[year_month_day] = {
                tiepnhan: item1,
                dangxuly: item2,
                dahoanthanh: item3
              };
            }
            // set to statistics array
            let month1 = currentMonth;
            let year1 = currentYear;
            for (let i = 1; i <= 31; i++) {
              let year_month_day = year1 + "-" + month1 + "-" + i;
              tempArr[year_month_day].tiepnhan.name =
                "Tiếp nhận: " + tempArr[year_month_day].tiepnhan.name;
              tempArr[year_month_day].dangxuly.name =
                "Đang xử lý: " + tempArr[year_month_day].dangxuly.name;
              tempArr[year_month_day].dahoanthanh.name =
                "Đã hoàn thành: " + tempArr[year_month_day].dahoanthanh.name;
              this.statistics.push(tempArr[year_month_day].tiepnhan);
              this.statistics.push(tempArr[year_month_day].dangxuly);
              this.statistics.push(tempArr[year_month_day].dahoanthanh);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeTextFirstDayOfMonthToVietNamese() {
      let days = document.getElementsByClassName("v-btn__content");
      for (let i = 0; i < days.length; i++) {
        let shortMonth = days[i].innerHTML.substring(0, 3);

        switch (shortMonth) {
          case "Jan":
            days[i].innerHTML =
              days[i].innerHTML.substring(4, days[i].length) + " Tháng 1";
            break;
          case "Feb":
            days[i].innerHTML =
              days[i].innerHTML.substring(4, days[i].length) + " Tháng 2";
            break;
          case "Mar":
            days[i].innerHTML =
              days[i].innerHTML.substring(4, days[i].length) + " Tháng 3";
            break;
          case "Apr":
            days[i].innerHTML =
              days[i].innerHTML.substring(4, days[i].length) + " Tháng 4";
            break;
          case "May":
            days[i].innerHTML =
              days[i].innerHTML.substring(4, days[i].length) + " Tháng 5";
            break;
          case "Jun":
            days[i].innerHTML =
              days[i].innerHTML.substring(4, days[i].length) + " Tháng 6";
            break;
          case "Jul":
            days[i].innerHTML =
              days[i].innerHTML.substring(4, days[i].length) + " Tháng 7";
            break;
          case "Aug":
            days[i].innerHTML =
              days[i].innerHTML.substring(4, days[i].length) + " Tháng 8";
            break;
          case "Sep":
            days[i].innerHTML =
              days[i].innerHTML.substring(4, days[i].length) + " Tháng 9";
            break;
          case "Oct":
            days[i].innerHTML =
              days[i].innerHTML.substring(4, days[i].length) + " Tháng 10";
            break;
          case "Nov":
            days[i].innerHTML =
              days[i].innerHTML.substring(4, days[i].length) + " Tháng 11";
            break;
          case "Dec":
            days[i].innerHTML =
              days[i].innerHTML.substring(4, days[i].length) + " Tháng 12";
            break;
        }
      }
    },
    changeMonthsTextToVietnamese(monthStr) {
      switch (monthStr) {
        case "January":
          return "Tháng một";
        case "February":
          return "Tháng hai";
        case "March":
          return "Tháng ba";
        case "April":
          return "Tháng tư";
        case "May":
          return "Tháng năm";
        case "June":
          return "Tháng sáu";
        case "July":
          return "Tháng bảy";
        case "August":
          return "Tháng tám";
        case "September":
          return "Tháng chín";
        case "October":
          return "Tháng mười";
        case "November":
          return "Tháng mười một";
        case "December":
          return "Tháng mười hai";
      }
      return monthStr;
    },
    getToday() {
      let today = new Date();
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      return date;
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
      this.currentMonth = new Date().getMonth() + 1;
      this.currentYear = new Date().getFullYear();
      this.getStatistics(this.currentMonth, this.currentYear);
    },
    prev() {
      this.$refs.calendar.prev();
      if (this.currentMonth > 1) {
        this.currentMonth -= 1;
      } else {
        this.currentMonth = 12;
        this.currentYear -= 1;
      }
      this.getStatistics(this.currentMonth, this.currentYear);
    },
    next() {
      this.$refs.calendar.next();
      if (this.currentMonth < 12) {
        this.currentMonth += 1;
      } else {
        this.currentMonth = 1;
        this.currentYear += 1;
      }

      this.getStatistics(this.currentMonth, this.currentYear);
    },
    updateRange({ start, end }) {
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    }
  }
};
</script>
<style>
div.v-calendar-weekly__head {
  padding-top: 5px;
}
div.v-event.v-event-start.v-event-end.white--text {
  margin: 0 auto;
}
</style>