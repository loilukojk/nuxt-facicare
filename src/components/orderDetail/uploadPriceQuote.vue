<template>
  <v-dialog v-model="show" scrollable max-width="550px">
    <v-card>
      <v-card-title style="background: #3498db; color: white">Thực hiện báo giá</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row>
            <v-col class="removePaddingTopBottom" md="12" style="cursor: pointer">
              <v-file-input v-model="priceQuoteFile" label="File báo giá"></v-file-input>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions style="text-align: center">
        <v-spacer></v-spacer>
        <v-btn color="blue" @click.stop="confirm" outlined mdall>
          <v-icon style="margin-right: 4px">mdi-send</v-icon>Gửi báo giá không kèm File
        </v-btn>
        <v-btn color="blue" @click.stop="uploadFileAndConfirm" style="color: white">
          <v-icon style="margin-right: 4px">mdi-send</v-icon>Gửi báo giá kèm File
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      priceQuoteFile: []
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
    confirm: function() {
      let path = "";
      this.$store.dispatch("setLinkQuote", path);

      // emit to send quote
      this.emitEvent("orderConfirm");
    },
    uploadFileAndConfirm: function() {
      // upload file
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crmappquote";
      let api = "/api/core/v1/minio/upload/" + bucket;
      let url = serverDomain + api;

      let data = new FormData();
      data.append("data", this.priceQuoteFile);

      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      axios
        .post(url, data, config)
        .then(res => {
          let data = res.data;
          if (data[0] != undefined) {
            let path = data[0].path;
            this.$store.dispatch("setLinkQuote", path);

            // emit to send quote
            this.emitEvent("orderConfirm");
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