<template>
  <v-row no-gutters>
    <!-- CRUD Technician Dialogs -->
    <create-technician-form-dialog
      v-model="showCreateTechnicianFormDialog"
      @reloadTechnicianTable="reloadTechnicianTable"
    />
    <view-technician-form-dialog
      v-model="showViewTechnicianFormDialog"
      @reloadTechnicianTable="reloadTechnicianTable"
    />
    <edit-technician-form-dialog
      v-model="showEditTechnicianFormDialog"
      @reloadTechnicianTable="reloadTechnicianTable"
    />
    <delete-technician-form-dialog
      v-model="showDeleteTechnicianFormDialog"
      @reloadTechnicianTable="reloadTechnicianTable"
    />

    <!-- Technician table -->
    <v-col :cols="12">
      <v-card class="pa-2" tile outlined>
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="5"
          :search="search"
          sort-by="record_id"
          class="elevation-1"
          @click:row="handleClick"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Danh sách Kỹ thuật viên</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <div style="width: 300px">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Tìm kiếm"
                  single-line
                  hide-details
                ></v-text-field>
              </div>
              <v-spacer></v-spacer>
              <v-btn color="success" @click.stop="showCreateTechnicianFormDialog=true">Thêm mới</v-btn>
            </v-toolbar>
          </template>
          <template
            v-slot:item.data_item.content.progressingTasks="{ item }"
          >{{item.data_item.content.progressingTasks}} tasks</template>
          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click.stop="editTechnicianInfo(item)">edit</v-icon>
            <v-icon small @click.stop="deleteTechnicianInfo(item)">delete</v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import CreateTechnicianFormDialog from "../components/technician/CreateTechnicianFormDialog";
import ViewTechnicianFormDialog from "../components/technician/ViewTechnicianFormDialog";
import EditTechnicianFormDialog from "../components/technician/EditTechnicianFormDialog";
import DeleteTechnicianFormDialog from "../components/technician/DeleteTechnicianFormDialog";
import MaterialCard from "../components/material/Card";

export default {
  data() {
    return {
      showCreateTechnicianFormDialog: false,
      showViewTechnicianFormDialog: false,
      showEditTechnicianFormDialog: false,
      showDeleteTechnicianFormDialog: false,
      search: "",
      headers: [
        {
          sortable: true,
          text: "ID",
          value: "record_id"
        },
        {
          sortable: true,
          text: "Kỹ thuật viên",
          value: "data_item.content.first_name"
        },
        {
          sortable: true,
          text: "Chuyên môn",
          value: "data_item.content.type",
          width: "400px"
        },
        {
          sortable: true,
          text: "Số điện thoại",
          value: "data_item.content.phone_number"
        },
        {
          sortable: false,
          text: "Thao tác",
          value: "action",
          align: "center"
        }
      ],
      items: [],
      errors: []
    };
  },
  components: {
    CreateTechnicianFormDialog,
    ViewTechnicianFormDialog,
    EditTechnicianFormDialog,
    DeleteTechnicianFormDialog,
    MaterialCard
  },
  methods: {
    checkAuthentication: function() {
      let isLoggedIn = this.$store.getters.loggedIn;
      if (!isLoggedIn) {
        this.$store.dispatch("startReLogin");
      }
    },
    viewTechnicianInfo: function(technician) {
      this.showViewTechnicianFormDialog = true;
      this.$store.dispatch("setTechnician", technician);
    },
    editTechnicianInfo: function(technician) {
      this.showEditTechnicianFormDialog = true;
      this.$store.dispatch("setTechnician", technician);
    },
    deleteTechnicianInfo: function(technician) {
      this.showDeleteTechnicianFormDialog = true;
      this.$store.dispatch("setTechnician", technician);
    },
    loadTechnicianTable: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
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
            this.items = response.data.data;
          } else {
            this.items = [];
          }
        })
        .catch(e => {
          this.items = [];
          this.errors.push(e);
        });
    },
    reloadTechnicianTable: function() {
      this.loadTechnicianTable();
    },
    handleClick(event) {
      /* eslint-disable no-console */
      this.viewTechnicianInfo(event);
    }
  },
  created() {
    this.$store.dispatch("setPageTitle", "Kỹ thuật viên");
    this.loadTechnicianTable();
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
</style>