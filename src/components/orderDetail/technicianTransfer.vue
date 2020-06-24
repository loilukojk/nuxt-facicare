<template>
  <v-dialog v-model="show" scrollable max-width="450px">
    <v-card>
      <v-card-title style="background: #3498db; color: white">Chuyển giao công việc</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-select
                v-model="oldCurrentTechnician"
                @change="oldTechnicianChange"
                :items="oldTechnicians"
                label="Kỹ thuật viên cũ"
                outlined
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-select
                v-model="remainingCurrentTechnician"
                @change="remainingTechnicianChange"
                :items="remainingTechnicians"
                label="Kỹ thuật viên mới"
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
          @click.stop="technicianTransfer"
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
      oldCurrentTechnician: "",
      oldChosenTechnician: {},
      remainingCurrentTechnician: "",
      remainingChosenTechnician: {}
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
    oldTechnicians() {
      let technicians = this.$store.getters.oldTechnicians;
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
    },
    remainingTechnicians() {
      let technicians = this.$store.getters.remainingTechnicians;
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
    technicianTransfer: function() {
      if (
        this.oldCurrentTechnician == "" ||
        this.remainingCurrentTechnician == ""
      ) {
        return;
      }
      let oldChosenTechnician = this.oldChosenTechnician;
      let remainingChosenTechnician = this.remainingChosenTechnician;

      let oldTechnicianInfo = oldChosenTechnician.record_id;
      let newTechnicianInfo = {
        id: remainingChosenTechnician.record_id,
        name:
          remainingChosenTechnician.data_item.content.last_name +
          " " +
          remainingChosenTechnician.data_item.content.first_name,
        phone: remainingChosenTechnician.data_item.content.phone_number,
        isTeamLeader: false,
        statusTask: "0"
      };

      let data = {
        oldTechnicianInfo: oldTechnicianInfo,
        newTechnicianInfo: newTechnicianInfo
      };

      // set old and new technician info
      this.$store.dispatch("setTechnicianTransferInfo", data);

      // emit to order detail page
      this.emitEvent("orderTechnicianTransfer");
    },
    oldTechnicianChange: function() {
      if (this.oldCurrentTechnician == undefined) {
        return;
      }

      // Get technician info
      let arr = this.oldCurrentTechnician.split("-");
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

      this.oldChosenTechnician = found;
    },
    remainingTechnicianChange: function() {
      if (this.remainingCurrentTechnician == "" || this.oldCurrentTechnician == "") {
        return;
      }

      // Get technician info
      let arr = this.remainingCurrentTechnician.split("-");
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

      this.remainingChosenTechnician = found;
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