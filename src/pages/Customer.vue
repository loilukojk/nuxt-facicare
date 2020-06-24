<template>
  <v-row no-gutters>
    <!-- CRUD Dialogs -->
    <create-form-dialog v-model="showCreateFormDialog" />
    <view-form-dialog v-model="showViewFormDialog" />
    <edit-form-dialog v-model="showEditFormDialog" />
    <delete-form-dialog v-model="showDeleteFormDialog" />

    <!-- Customer table -->
    <v-col :cols="12">
      <v-card class="pa-2" tile outlined>
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="7"
          :search="search"
          class="elevation-1"
          @click:row="handleClick"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Danh sách Khách hàng</v-toolbar-title>
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
              <v-btn color="success" @click.stop="showCreateFormDialog=true">Thêm mới</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.data_item.content.personalInfo.customerLevel="{ item }">
            <v-chip
              v-if="item.data_item.content.personalInfo.customerLevel == 'Thân thiết'"
              color="orange"
              dark
            >Thân thiết</v-chip>
            <v-chip v-else color="grey" dark>Bình thường</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click.stop="editInfo(item)">edit</v-icon>
            <v-icon small @click.stop="deleteInfo(item)">delete</v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import CreateFormDialog from "../components/customer/CreateCustomerFormDialog";
import ViewFormDialog from "../components/customer/ViewCustomerFormDialog";
import EditFormDialog from "../components/customer/EditCustomerFormDialog";
import DeleteFormDialog from "../components/customer/DeleteCustomerFormDialog";
import MaterialCard from "../components/material/Card";

export default {
  data() {
    return {
      showCreateFormDialog: false,
      showViewFormDialog: false,
      showEditFormDialog: false,
      showDeleteFormDialog: false,
      search: "",
      headers: [
        {
          sortable: true,
          text: "Khách hàng",
          value: "data_item.content.personalInfo.name"
        },
        {
          sortable: true,
          text: "Số điện thoại",
          value: "data_item.content.personalInfo.phone"
        },
        {
          sortable: true,
          text: "Email",
          value: "data_item.content.personalInfo.email"
        },
        {
          sortable: true,
          text: "Cấp độ",
          value: "data_item.content.personalInfo.customerLevel"
        },
        {
          sortable: false,
          text: "Thao tác",
          value: "action",
          align: "center"
        }
      ],
      errors: []
    };
  },
  components: {
    CreateFormDialog,
    ViewFormDialog,
    EditFormDialog,
    DeleteFormDialog,
    MaterialCard
  },
  computed: {
    items() {
      return this.$store.getters.customerList;
    }
  },
  methods: {
    checkAuthentication: function() {
      let isLoggedIn = this.$store.getters.loggedIn;
      if (!isLoggedIn) {
        this.$store.dispatch("startReLogin");
      }
    },
    viewInfo: function(item) {
      this.showViewFormDialog = true;
      this.$store.dispatch("setCustomer", item);
    },
    editInfo: function(item) {
      this.showEditFormDialog = true;
      this.$store.dispatch("setCustomer", item);
    },
    deleteInfo: function(item) {
      this.showDeleteFormDialog = true;
      this.$store.dispatch("setCustomer", item);
    },
    loadCustomerTable: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      this.$store.dispatch("getCustomerList");
    },
    handleClick(event) {
      /* eslint-disable no-console */
      this.viewInfo(event);
    }
  },
  created() {
    this.$store.dispatch("setPageTitle", "Đối tác khách hàng");
    this.loadCustomerTable();
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