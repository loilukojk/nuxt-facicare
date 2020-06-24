<template>
  <v-dialog v-model="show" scrollable max-width="450px">
    <v-card>
      <v-card-title style="background: #3498db; color: white">Phân công KTV thực hiện khảo sát</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row>
            <v-col md="4">Ngày làm việc:</v-col>
            <v-col md="8">
              <v-datetime-picker
                v-model="workDate"
                :textFieldProps="datetime.textFieldProps"
                :date-picker-props="datetime.dateProps"
                :time-picker-props="datetime.timeProps"
                date-format="dd/MM/yyyy"
                time-format="HH:mm:ss"
              >
                <template slot="actions" slot-scope="{ parent }">
                  <v-btn color="error lighten-1" @click.native="parent.clearHandler">Xóa</v-btn>
                  <v-btn color="success darken-1" @click="parent.okHandler">Xong</v-btn>
                </template>
              </v-datetime-picker>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="4">Deadline:</v-col>
            <v-col md="8">
              <v-datetime-picker
                v-model="deadline"
                :textFieldProps="datetime.textFieldProps"
                :date-picker-props="datetime.dateProps"
                :time-picker-props="datetime.timeProps"
                date-format="dd/MM/yyyy"
                time-format="HH:mm:ss"
              >
                <template slot="actions" slot-scope="{ parent }">
                  <v-btn color="error lighten-1" @click.native="parent.clearHandler">Xóa</v-btn>
                  <v-btn color="success darken-1" @click="parent.okHandler">Xong</v-btn>
                </template>
              </v-datetime-picker>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-select
                v-model="currentTechnician"
                @change="technicianChange"
                :items="technicians"
                label="Chọn 1 kỹ thuật viên"
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          style="background: #3498db !important; color: white !important"
          @click.stop="assignTechnician"
        >Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      contractFile: [],
      currentTechnician: "",
      chosenTechnician: {},
      workDate: "",
      deadline: "",
      datetime: {
        textFieldProps: {
          outlined: true
        },
        dateProps: {
          headerColor: "primary"
        },
        timeProps: {
          useSeconds: true,
          ampmInTitle: true
        }
      }
    };
  },
  props: {
    value: Boolean
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    technicians() {
      let technicians = this.$store.getters.technicians;
      let result = [];
      for (let i = 0; i < technicians.length; i++) {
        let temp =
          technicians[i].data_item.content.last_name +
          " " +
          technicians[i].data_item.content.first_name +
          " - " +
          technicians[i].data_item.content.phone_number;
        result.push(temp);
      }
      return result;
    }
  },
  methods: {
    emitEvent: function(tempEvent) {
      this.$emit(tempEvent);
    },
    assignTechnician: function() {
      let chosenTechnician = this.chosenTechnician;

      let workDate = this.formatDateTime(this.workDate)
      let deadline = this.formatDateTime(this.deadline)

      let surveyByTechnicianInfo = {
        workDate: workDate,
        deadline: deadline,
        assignee: {
          id: chosenTechnician.record_id,
          name:
            chosenTechnician.data_item.content.last_name +
            " " +
            chosenTechnician.data_item.content.first_name,
          phone: chosenTechnician.data_item.content.phone_number
        },
        content: {}
      };

      // set chosen technician
      this.$store.dispatch("setSurveyByTechnicianInfo", surveyByTechnicianInfo);

      // emit to order detail page
      this.emitEvent("orderAssignTechnicianSurvey");
    },
    technicianChange: function() {
      if (this.currentTechnician == undefined) {
        return;
      }

      // Get technician info
      let arr = this.currentTechnician.split("-");
      let name = arr[0].trim();
      let phone = arr[1].trim();

      let tempTechnicians = this.$store.getters.technicians;
      let found = tempTechnicians.find(
        element =>
          element.data_item.content.last_name +
            " " +
            element.data_item.content.first_name ==
            name && element.data_item.content.phone_number == phone
      );

      this.chosenTechnician = found;
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

      result = arr[2] + "/"; // day
      result += this.getMonthDateTimeValue(arr[1]) + "/"; // month
      result += arr[3] + " "; // year
      result += arr[4]; // time
      return result;
    },
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