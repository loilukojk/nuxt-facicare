<template>
  <v-dialog v-model="show" scrollable max-width="350px">
    <v-card>
      <v-card-title style="background: #3498db; color: white">Upload hợp đồng</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12" style="cursor: pointer">
              <v-file-input v-model="contractFile" label="File hợp đồng"></v-file-input>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          style="background: #3498db !important; color: white !important"
          @click.stop="uploadFileAndSendContract"
        >Gửi</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      contractFile: []
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
    }
  },
  methods: {
    emitEvent: function(tempEvent) {
      this.$emit(tempEvent);
    },
    uploadFileAndSendContract: function() {
      // upload file
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crmappcontract";
      let api = "/api/core/v1/minio/upload/" + bucket;
      let url = serverDomain + api;

      let data = new FormData();
      data.append("data", this.contractFile);

      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      axios
        .post(url, data, config)
        .then(res => {
          let data = res.data;
          if (data[0] != undefined) {
            let path = data[0].path;
            this.$store.dispatch("setLinkContract", path);

            // emit to send contract
            this.emitEvent("orderConfirmSendingContract");
          } else {
            this.$notify({
              group: "notifications",
              title: "XẢY RA LỖI",
              text: "Thao tác đã không được thực hiện!",
              type: "error",
              width: "400px"
            });
          }
        })
        .catch(err => {
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