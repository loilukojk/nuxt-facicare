<template>
  <v-container>
    <!-- Upload Contract Dialog -->
    <upload-contract-form
      v-model="showUploadContractForm"
      @orderConfirmSendingContract="orderConfirmSendingContract"
    />

    <!-- Upload Price-Quote File Dialog -->
    <upload-price-quote-form v-model="showPriceQuoteForm" @orderConfirm="orderConfirm" />

    <!-- Upload Price-Quote File Again Dialog -->
    <upload-price-quote-again-form
      v-model="showPriceQuoteAgainForm"
      @orderConfirmAgain="orderConfirmAgain"
    />

    <!-- Assign Technician to take survey Dialog -->
    <technician-survey-form
      v-model="showTechnicianSurveyForm"
      @orderAssignTechnicianSurvey="orderAssignTechnicianSurvey"
    />

    <!-- Transfer of work Dialog -->
    <technician-transfer-form
      v-model="showTechnicianTransferForm"
      @orderTechnicianTransfer="orderTechnicianTransfer"
    />

    <!-- Order Timeline Dialog -->
    <order-timeline v-model="showOrderTimeline" />

    <!-- Toolbars -->
    <v-card-actions>
      <v-btn v-if="!isCreateNew" :style="statusColor(order)">
        {{
        order.data_item.content.status
        }}
      </v-btn>

      <v-spacer></v-spacer>

      <!-- Button Phân công KTV đi khảo sát -->
      <v-btn
        v-if="isShowKhaoSatButton && !isCreateNew"
        color="warning"
        @click.stop="showTechnicianSurveyForm=true"
        title="Phân công KTV thực hiện khảo sát"
        outlined
        mdall
      >
        <v-icon style="margin-right: 4px">mdi-send</v-icon>Phân công khảo sát
      </v-btn>

      <!-- Button Báo giá -->
      <v-btn
        v-if="isShowBaoGiaButton && !isCreateNew"
        color="warning"
        @click.stop="showPriceQuoteForm=true"
        title="Báo giá cho khách hàng"
        outlined
        mdall
      >
        <v-icon style="margin-right: 4px">mdi-send</v-icon>Báo giá
      </v-btn>

      <!-- Button Báo giá lại -->
      <v-btn
        v-if="isShowBaoGiaLaiButton && !isCreateNew"
        color="warning"
        @click.stop="showPriceQuoteAgainForm=true"
        title="Thực hiện báo giá lại"
        outlined
        mdall
      >
        <v-icon style="margin-right: 4px">mdi-send</v-icon>
        Báo giá lại lần {{order.data_item.content.priceQuoteTimes}}
      </v-btn>

      <!-- Button Xác nhận tạo mới 1 đơn hàng -->
      <v-btn
        v-if="isShowBaoGiaButton && isCreateNew"
        color="success"
        @click="orderCreateNew"
        title="Tạo mới một đơn hàng"
        outlined
        mdall
      >
        <v-icon style="margin-right: 4px">mdi-check-circle-outline</v-icon>Chấp
        nhận
      </v-btn>

      <!-- Button Xác nhận phân công -->
      <v-btn
        v-if="isUpdate"
        color="success"
        @click="orderUpdate"
        title="Xác nhận phân công"
        outlined
        mdall
      >
        <v-icon style="margin-right: 4px">mdi-check-circle-outline</v-icon>Xác
        nhận phân công
      </v-btn>

      <!-- Button Xác nhận đã gửi hợp đồng -->
      <v-btn
        v-if="isSendContract"
        color="success"
        @click.stop="showUploadContractForm=true"
        title="Xác nhận đã gửi hợp đồng"
        outlined
        mdall
      >
        <v-icon style="margin-right: 4px">mdi-check-circle-outline</v-icon>Xác
        nhận đã gửi hợp đồng
      </v-btn>

      <!-- Button Xác nhận đã ký hợp đồng -->
      <v-btn
        v-if="isSignContract"
        color="success"
        @click="orderConfirmSigningContract"
        title="Xác nhận đã ký hợp đồng"
        outlined
        mdall
      >
        <v-icon style="margin-right: 4px">mdi-check-circle-outline</v-icon>Xác
        nhận đã ký hợp đồng
      </v-btn>

      <!-- Button Chuyển giao công việc của KTV -->
      <v-btn
        v-if="isShowChuyenGiaoButton && !isCreateNew"
        color="warning"
        @click="openTechnicianTransferDialog"
        title="Chuyển giao công việc từ một KTV sang một KTV"
        outlined
        mdall
      >
        <v-icon style="margin-right: 4px">mdi-send</v-icon>Chuyển giao
      </v-btn>

      <!-- Button Xác nhận đã chỉnh sửa đơn hàng: thông tin khách hàng, thông tin làm việc -->
      <v-btn
        v-if="isConfirmNote"
        color="success"
        @click="orderConfirmNote"
        title="Xác nhận chỉnh sửa thông tin đơn hàng"
        outlined
        mdall
      >
        <v-icon style="margin-right: 4px">mdi-check-circle-outline</v-icon>Xác
        nhận chỉnh sửa
      </v-btn>

      <!-- Các Button khác -->
      <v-divider
        v-if="
        isShowBaoGiaLaiButton ||
          isShowKhaoSatButton ||
          isShowBaoGiaButton ||
            isUpdate ||
            isConfirmNote ||
            isSendContract ||
            isSignContract ||
            isShowChuyenGiaoButton
        "
        class="mx-4"
        vertical
        style="border-color: #bdc3c7 !important"
      ></v-divider>

      <div v-if="isShowSpecialButton">
        <v-btn
          color="error"
          @click="orderCancel"
          title="Thực hiện hủy đơn hàng"
          outlined
          small
          style="margin-right: 10px"
        >
          <v-icon style="margin-right: 4px">mdi-cancel</v-icon>Hủy đơn hàng
        </v-btn>
        <v-btn
          color="primary"
          @click="orderPending"
          title="Chuyển đơn hàng vào trạng thái Pending"
          outlined
          small
        >
          <v-icon style="margin-right: 4px">mdi-pause</v-icon>Pending
        </v-btn>
      </div>

      <v-divider
        v-if="isShowSpecialButton"
        class="mx-4"
        vertical
        style="border-color: #bdc3c7 !important"
      ></v-divider>

      <v-btn
        style="background: white !important; color: #34495e !important"
        @click="itemClick('Order')"
        title="Đi đến danh sách các đơn hàng"
        outlined
        mdall
      >
        <v-icon style="margin-right: 4px">mdi-library-books</v-icon>Danh sách
      </v-btn>
    </v-card-actions>

    <!-- Contents -->
    <v-card>
      <v-card-text>
        <v-container grid-list-md>
          <!-- Ghi chú yêu cầu báo giá lại -->
          <v-row
            v-if="isShowBaoGiaLaiButton && !isCreateNew && order.data_item.content.priceQuoteRequests!= undefined"
          >
            <v-col class="price-quote-request" md="12">
              <span>Ghi chú của khách hàng: {{order.data_item.content.priceQuoteRequests[order.data_item.content.priceQuoteRequests.length - 1]}}</span>
            </v-col>
          </v-row>

          <!-- Radio buttons: Trước khảo sát / Sau khảo sát -->
          <v-row v-if="afterSurvey">
            <v-radio-group
              v-model="isAfterSurvey"
              class="removePaddingTopBottom"
              style="margin-top: 0px"
              @change="showSurveyOrNot"
            >
              <v-radio label="Đơn hàng sau khảo sát" color="blue" value="true"></v-radio>
              <v-radio label="Đơn hàng trước khảo sát" color="blue" value="false"></v-radio>
            </v-radio-group>
          </v-row>

          <!-- Customer Info, Require Info & Payment Info, Service Info -->
          <v-divider v-if="afterSurvey" style="margin: 10px auto"></v-divider>
          <v-row>
            <v-col class="removePaddingTopBottom" md="6">
              <!-- Cusomer Info -->
              <v-row>
                <v-col class="removePaddingTopBottom" md="12">
                  <fieldset class="fieldset-info-box">
                    <legend class="legend-info-box">Khách hàng</legend>
                    <v-row class="input-group" v-if="!isCreateNew">
                      <v-col md="3" class="order-detail-label">ID:</v-col>
                      <v-col md="9" class="order-detail-input">
                        <input
                          v-model="order.data_item.content.customerInfo.id"
                          :readonly="isCustomerInfoReadonly"
                        />
                      </v-col>
                    </v-row>
                    <v-row class="input-group">
                      <v-col md="3" class="order-detail-label">Tên:</v-col>
                      <v-col md="9" class="order-detail-input">
                        <input
                          v-model="order.data_item.content.customerInfo.name"
                          :readonly="isCustomerInfoReadonly"
                        />
                      </v-col>
                    </v-row>
                    <v-row class="input-group">
                      <v-col md="3" class="order-detail-label">Số điện thoại:</v-col>
                      <v-col md="9" class="order-detail-input">
                        <input
                          v-model="order.data_item.content.customerInfo.phone"
                          :readonly="isCustomerInfoReadonly"
                        />
                      </v-col>
                    </v-row>
                    <v-row class="input-group">
                      <v-col md="3" class="order-detail-label">Địa chỉ:</v-col>
                      <v-col v-if="isCreateNew" md="9" class="order-detail-input">
                        <select
                          v-model="currentProvince"
                          @change="changeProvince"
                          style="margin-bottom: 5px"
                        >
                          <option
                            v-for="item in addressInfo.province_list"
                            :disabled="isCustomerInfoReadonly"
                            :key="item.province_code"
                            :value="item.province_code"
                          >{{ item.province_name }}</option>
                        </select>
                        <select
                          v-model="currentDistrict"
                          @change="changeDistrict"
                          style="margin-bottom: 5px"
                        >
                          <option
                            :disabled="isCustomerInfoReadonly"
                            value="''"
                            selected
                            hidden
                          >Quận / Huyện</option>
                          <option
                            v-for="item in addressInfo.district_list"
                            :disabled="isCustomerInfoReadonly"
                            :key="item.district_code"
                            :value="item.district_code"
                          >{{ item.district_name }}</option>
                        </select>
                        <select
                          v-model="currentWard"
                          @change="changeWard"
                          style="margin-bottom: 5px"
                        >
                          <option
                            :disabled="isCustomerInfoReadonly"
                            value="''"
                            selected
                            hidden
                          >Phường / Xã</option>
                          <option
                            v-for="item in addressInfo.ward_list"
                            :disabled="isCustomerInfoReadonly"
                            :key="item.ward_code"
                            :value="item.ward_code"
                          >{{ item.ward_name }}</option>
                        </select>
                        <input
                          placeholder="Số nhà, tên đường"
                          v-model="customerAddress.houseNumberAndStreetName"
                          :readonly="isCustomerInfoReadonly"
                        />
                      </v-col>
                      <v-col v-else md="9" class="order-detail-input">
                        <input
                          v-model="order.data_item.content.customerInfo.address"
                          :readonly="isCustomerInfoReadonly"
                        />
                      </v-col>
                    </v-row>
                    <v-row v-if="isCreateNew">
                      <v-col md="12">
                        <v-col
                          md="9"
                          offset-md="3"
                          style="text-align: left; margin-top: 0px; margin-bottom: 0px"
                        >
                          Bạn có phải người chúng tôi cần liên hệ trực tiếp khi
                          đến cung cấp dịch vụ hay không?
                          <v-radio-group
                            v-model="isNotCustomerDirectContact"
                            style="margin-top: 0px; margin-bottom: 0px"
                          >
                            <v-radio
                              v-for="(item, index) in isNotCustomerDirectList"
                              :key="index"
                              :label="item.title"
                              :value="item.value"
                              style="margin-top: 0px; margin-bottom: 0px;"
                            ></v-radio>
                          </v-radio-group>
                        </v-col>
                      </v-col>
                    </v-row>

                    <!-- Cusomer Direct Contact Info -->
                    <v-row
                      v-show="isNotCustomerDirectContact || !isCreateNew"
                      style="padding: 0px 15px 15px 15px; margin-top: 0px"
                    >
                      <v-col class="removePaddingTopBottom" md="12">
                        <fieldset class="fieldset-info-box">
                          <legend class="legend-info-box">Người liên hệ trực tiếp</legend>
                          <v-row class="input-group">
                            <v-col md="3" class="order-detail-label">Tên:</v-col>
                            <v-col md="9" class="order-detail-input">
                              <input
                                v-model="
                                  order.data_item.content.customerDirectContact
                                    .name
                                "
                                :readonly="isCustomerInfoReadonly"
                              />
                            </v-col>
                          </v-row>
                          <v-row class="input-group">
                            <v-col md="3" class="order-detail-label">Số điện thoại:</v-col>
                            <v-col md="9" class="order-detail-input">
                              <input
                                v-model="
                                  order.data_item.content.customerDirectContact
                                    .phone
                                "
                                :readonly="isCustomerInfoReadonly"
                              />
                            </v-col>
                          </v-row>
                          <v-row class="input-group">
                            <v-col md="3" class="order-detail-label">Địa chỉ:</v-col>
                            <v-col md="9" class="order-detail-input">
                              <input
                                v-model="
                                  order.data_item.content.customerDirectContact
                                    .address
                                "
                                :readonly="isCustomerInfoReadonly"
                              />
                            </v-col>
                          </v-row>
                        </fieldset>
                      </v-col>
                    </v-row>
                  </fieldset>
                </v-col>
              </v-row>

              <!-- Require Info -->
              <v-row style="margin-top: 10px">
                <v-col class="removePaddingTopBottom" md="12">
                  <fieldset class="fieldset-info-box">
                    <legend class="legend-info-box">Thông tin làm việc</legend>
                    <v-row class="input-group">
                      <v-col md="3" class="order-detail-label">Ngày:</v-col>
                      <v-col md="9" class="order-customer-datetime">
                        <v-datetime-picker
                          v-model="order.data_item.content.expectedTime"
                          :textFieldProps="datetime.textFieldProps"
                          :date-picker-props="datetime.dateProps"
                          :time-picker-props="datetime.timeProps"
                          :disabled="isCustomerInfoReadonly"
                          @input="getRequireDateTimeValue"
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
                    <v-row class="input-group">
                      <v-col md="3" class="order-detail-label" style>Địa điểm:</v-col>
                      <v-col md="9" class="order-detail-input">
                        <input
                          v-model="order.data_item.content.expectedAddress"
                          :readonly="isCustomerInfoReadonly"
                        />
                      </v-col>
                    </v-row>
                    <v-row class="input-group">
                      <v-col md="3" class="order-detail-label">Nội dung công việc bảo trì:</v-col>
                      <v-col md="9" class="order-detail-input">
                        <input
                          v-model="order.data_item.content.note"
                          :readonly="isCustomerInfoReadonly"
                        />
                      </v-col>
                    </v-row>
                    <v-row v-if="isCreateNew">
                      <v-col md="12">
                        <v-col
                          md="9"
                          offset-md="3"
                          style="text-align: left; margin-top: 0px; margin-bottom: 0px"
                        >
                          Loại đặt lịch?
                          <v-radio-group
                            v-model="isHasContract"
                            style="margin-top: 0px; margin-bottom: 0px"
                          >
                            <v-radio
                              v-for="(item, index) in isHasContractList"
                              :key="index"
                              :label="item.title"
                              :value="item.value"
                              style="margin-top: 0px; margin-bottom: 0px;"
                            ></v-radio>
                          </v-radio-group>
                        </v-col>
                      </v-col>
                    </v-row>
                  </fieldset>
                </v-col>
              </v-row>

              <!-- Payment Info -->
              <v-row v-if="!isCreateNew" style="margin-top: 10px">
                <v-col class="removePaddingTopBottom" md="12">
                  <fieldset class="fieldset-info-box">
                    <legend class="legend-info-box">Thông tin thanh toán</legend>
                    <v-row class="input-group">
                      <v-col md="3" class="order-detail-label">Trạng thái:</v-col>
                      <v-col md="9" class="order-detail-input">
                        <select v-model="currentPaymentStatus" @change="changePaymentStatus">
                          <option :disabled="isReadonly">Chưa thanh toán</option>
                          <option :disabled="isReadonly">Đã thanh toán</option>
                        </select>
                      </v-col>
                    </v-row>
                    <v-row class="input-group">
                      <v-col md="3" class="order-detail-label" style>Hình thức:</v-col>
                      <v-col md="9" class="order-detail-input">
                        <select v-model="currentPaymentMethod" @change="changePaymentMethod">
                          <option :disabled="isReadonly">Tiền mặt</option>
                          <option :disabled="isReadonly">Thẻ</option>
                        </select>
                      </v-col>
                    </v-row>
                    <v-row class="input-group">
                      <v-col md="3" class="order-detail-label">Ngày:</v-col>
                      <v-col md="9" class="order-customer-datetime">
                        <v-datetime-picker
                          v-model="
                            order.data_item.content.paymentInfo.paymentDate
                          "
                          :textFieldProps="datetime.textFieldProps"
                          :date-picker-props="datetime.dateProps"
                          :time-picker-props="datetime.timeProps"
                          :disabled="isReadonly"
                          @input="getPaymentDateTimeValue"
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
                    <v-row class="input-group">
                      <v-col md="3" class="order-detail-label">Invoice:</v-col>
                      <v-col md="9" class="order-detail-input">
                        <input v-model="invoiceFormatToString" :readonly="isReadonly" />
                      </v-col>
                    </v-row>
                  </fieldset>
                </v-col>
              </v-row>
            </v-col>

            <!-- Service Info -->
            <v-col class="removePaddingTopBottom" md="6">
              <fieldset class="fieldset-info-box" style="padding: 20px">
                <legend class="legend-info-box">Dịch vụ đăng ký</legend>
                <v-card-actions style="padding-top: 0px">
                  <span style="font-size: 20px">
                    Tổng chi phí:
                    {{ order.data_item.content.orderValue.sum }} (VND)
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" outlined @click="chargeTotal">
                    <v-icon>mdi-calculator</v-icon>Tính phí
                  </v-btn>
                </v-card-actions>

                <!-- Chosen Services -->
                <p>
                  Dịch vụ đã chọn:
                  <template v-if="isCreateNew">
                    {{
                    currentChosenServices
                    }}
                  </template>
                </p>
                <!-- <p
                  v-for="(item, index) in order.data_item.content.orderValue.details"
                  :key="'chosenService_' + index"
                  style="cursor: pointer"
                  @click="serviceCheckboxClick(item.id)"
                >{{(index + 1) + ". " + item.name + ' --- ID: ' + item.id}}</p>-->
                <v-card
                  v-for="(item, index) in order.data_item.content.orderValue
                    .details"
                  :key="'chosenService_' + index"
                  style="cursor: pointer"
                  @click="serviceCheckboxClick(item)"
                  class="d-inline-block mx-auto"
                  outlined
                >
                  <v-container>
                    <v-row style="text-align: center">
                      <v-col cols="auto" style="padding-top: 0px; padding-bottom: 0px">
                        <v-img height="65" width="65" :src="item.image"></v-img>
                        {{ item.name }}
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>

                <!-- Service Details -->
                <v-card
                  v-for="(item, index) in order.data_item.content.orderValue
                    .details"
                  :key="item.id"
                  class="service-card"
                  tile
                  outlined
                  v-bind:class="{ noneDisplay: isActiveNoneDisplay[item.id] }"
                  :id="item.id"
                >
                  <v-row class="input-group">
                    <v-col md="3" class="order-detail-label">ID:</v-col>
                    <v-col md="9" class="order-detail-span">
                      <span>{{ item.id }}</span>
                    </v-col>
                  </v-row>
                  <v-row class="input-group">
                    <v-col md="3" class="order-detail-label">Dịch vụ:</v-col>
                    <v-col md="9" class="order-detail-span">
                      <span>{{ item.name }}</span>
                    </v-col>
                  </v-row>
                  <v-row class="input-group">
                    <v-col md="3" class="order-detail-label">Chi phí:</v-col>
                    <v-col md="9" class="order-detail-input">
                      <input
                        v-model="item.charge"
                        @keydown="handleDeleteNBackspace($event, index)"
                        @keypress="formatServiceCharge($event, index)"
                        @change="deleteServiceCharge($event, index)"
                        :readonly="isReadonly"
                      />
                      (VND)
                    </v-col>
                  </v-row>
                </v-card>
              </fieldset>
            </v-col>
          </v-row>

          <!-- Assign Info -->
          <v-divider v-if="assignInfoCode > 0" style="margin: 10px auto"></v-divider>
          <v-row v-if="assignInfoCode > 0">
            <!-- Assigner -->
            <v-col class="removePaddingTopBottom" md="6">
              <fieldset class="fieldset-info-box">
                <legend class="legend-info-box">Người phân công</legend>
                <v-row class="input-group">
                  <v-col md="3" class="order-detail-label">ID:</v-col>
                  <v-col md="9" class="order-detail-input">
                    <input v-model="order.data_item.content.assignInfo.assigner.id" readonly="true" />
                  </v-col>
                </v-row>
                <v-row class="input-group">
                  <v-col md="3" class="order-detail-label">Tên:</v-col>
                  <v-col md="9" class="order-detail-input">
                    <input
                      v-model="order.data_item.content.assignInfo.assigner.name"
                      readonly="true"
                    />
                  </v-col>
                </v-row>
                <v-row class="input-group">
                  <v-col md="3" class="order-detail-label">Số điện thoại:</v-col>
                  <v-col md="9" class="order-detail-input">
                    <input
                      v-model="
                        order.data_item.content.assignInfo.assigner.phone
                      "
                      readonly="true"
                    />
                  </v-col>
                </v-row>
                <v-row class="input-group" v-if="!isUpdate">
                  <v-col md="3" class="order-detail-label">Ngày phân công:</v-col>
                  <v-col md="9" class="order-customer-datetime">
                    <v-datetime-picker
                      v-model="order.data_item.content.assignInfo.assignDate"
                      :textFieldProps="datetime.textFieldProps"
                      :date-picker-props="datetime.dateProps"
                      :time-picker-props="datetime.timeProps"
                      :disabled="true"
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
              </fieldset>
            </v-col>
            <!-- Assignee -->
            <v-col class="removePaddingTopBottom" md="6">
              <fieldset class="fieldset-info-box">
                <legend class="legend-info-box">Kỹ thuật viên</legend>
                <v-row class="input-group">
                  <v-col md="3" class="order-detail-label">Ngày làm việc:</v-col>
                  <v-col md="9" class="order-customer-datetime">
                    <v-datetime-picker
                      v-model="
                        order.data_item.content.assignInfo.workDate
                      "
                      :textFieldProps="datetime.textFieldProps"
                      :date-picker-props="datetime.dateProps"
                      :time-picker-props="datetime.timeProps"
                      :disabled="isAssignInfoReadonly"
                      @input="getAssigneeWorkDateValue"
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
                <v-row class="input-group">
                  <v-col md="3" class="order-detail-label">Deadline:</v-col>
                  <v-col md="9" class="order-customer-datetime">
                    <v-datetime-picker
                      v-model="
                        order.data_item.content.assignInfo.deadline
                      "
                      :textFieldProps="datetime.textFieldProps"
                      :date-picker-props="datetime.dateProps"
                      :time-picker-props="datetime.timeProps"
                      :disabled="isAssignInfoReadonly"
                      @input="getAssigneeDeadlineValue"
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
                <v-row
                  class="input-group"
                  v-if="
                    order.data_item.content.status === 'Đã chốt, chưa phân công'
                  "
                >
                  <v-col md="3" class="order-detail-label">Chọn KTV:</v-col>
                  <v-col md="9" class="order-detail-input">
                    <select v-model="currentTechnician" @change="technicianChange()">
                      <option
                        v-for="(item, key) in technicians"
                        :key="key"
                        :id="item.data_item.id"
                        :disabled="isAssignInfoReadonly"
                      >
                        {{ item.data_item.content.last_name }}
                        {{ item.data_item.content.first_name }} -
                        {{ item.data_item.content.phone_number }}
                      </option>
                    </select>
                  </v-col>
                </v-row>
                <template v-if="order.data_item.content.assignInfo.assignee.length == 0">
                  <v-card
                    v-for="(item) in chosenTechnicians"
                    :key="item.record_id"
                    class="service-card"
                    tile
                    outlined
                    :id="item.record_id"
                    style="margin: 0px 15px 4px 15px"
                  >
                    <v-row class="input-group">
                      <v-col md="3" class="order-detail-label">Kỹ thuật viên:</v-col>
                      <v-col md="9" class="order-detail-span">
                        <span>
                          {{ item.data_item.content.last_name }} {{item.data_item.content.first_name}} - {{ item.data_item.content.phone_number }}
                          <v-icon
                            style="float: right; cursor: pointer"
                            @click="removeChosenTechnician(item)"
                          >mdi-close</v-icon>
                        </span>
                      </v-col>
                    </v-row>
                    <v-row class="input-group">
                      <v-col md="12" class="order-detail-span">
                        <input
                          type="checkbox"
                          :id="item.record_id"
                          v-model="item.data_item.content.isTeamLeader"
                          style="margin-left: 20px"
                        />
                        Trưởng nhóm
                      </v-col>
                    </v-row>
                  </v-card>
                </template>
                <v-card
                  v-for="(item) in order.data_item.content.assignInfo.assignee"
                  :key="item.id"
                  class="service-card"
                  tile
                  outlined
                  :id="item.id"
                  style="margin: 0px 15px 4px 15px"
                >
                  <v-row class="input-group">
                    <v-col md="3" class="order-detail-label">Kỹ thuật viên:</v-col>
                    <v-col md="9" class="order-detail-span">
                      <span>{{ item.name }} - {{ item.phone }}</span>
                      <br v-if="item.isTeamLeader" />
                      <span v-if="item.isTeamLeader">(Trưởng nhóm)</span>
                      <template v-if="item.statusTask == '1'">
                        <br />
                        <span>(Đã hoàn thành tác vụ)</span>
                      </template>
                    </v-col>
                  </v-row>
                </v-card>
              </fieldset>
            </v-col>
          </v-row>

          <!-- Kỹ thuật viên khảo sát -->
          <template v-if="order.data_item.content.surveyByTechnicianInfo != undefined">
            <v-divider
              v-if="order.data_item.content.surveyByTechnicianInfo.assignee.id != '' && !isCreateNew"
              style="margin: 10px auto"
            ></v-divider>
            <v-row
              v-if="order.data_item.content.surveyByTechnicianInfo.assignee.id != '' && !isCreateNew"
            >
              <v-col class="removePaddingTopBottom" md="6">
                <fieldset class="fieldset-info-box">
                  <legend class="legend-info-box">KTV khảo sát</legend>
                  <v-row class="input-group">
                    <v-col md="3" class="order-detail-label">ID:</v-col>
                    <v-col md="9" class="order-detail-input">
                      <input
                        v-model="order.data_item.content.surveyByTechnicianInfo.assignee.id"
                        readonly="true"
                      />
                    </v-col>
                  </v-row>
                  <v-row class="input-group">
                    <v-col md="3" class="order-detail-label">Tên:</v-col>
                    <v-col md="9" class="order-detail-input">
                      <input
                        v-model="order.data_item.content.surveyByTechnicianInfo.assignee.name"
                        readonly="true"
                      />
                    </v-col>
                  </v-row>
                  <v-row class="input-group">
                    <v-col md="3" class="order-detail-label">Số điện thoại:</v-col>
                    <v-col md="9" class="order-detail-input">
                      <input
                        v-model="
                        order.data_item.content.surveyByTechnicianInfo.assignee.phone
                      "
                        readonly="true"
                      />
                    </v-col>
                  </v-row>
                  <v-row class="input-group">
                    <v-col md="3" class="order-detail-label">Ngày làm việc:</v-col>
                    <v-col md="9" class="order-customer-datetime">
                      <v-datetime-picker
                        v-model="
                        order.data_item.content.surveyByTechnicianInfo.workDate
                      "
                        :textFieldProps="datetime.textFieldProps"
                        :date-picker-props="datetime.dateProps"
                        :time-picker-props="datetime.timeProps"
                        :disabled="true"
                        @input="getAssigneeWorkDateValue"
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
                  <v-row class="input-group">
                    <v-col md="3" class="order-detail-label">Deadline:</v-col>
                    <v-col md="9" class="order-customer-datetime">
                      <v-datetime-picker
                        v-model="
                        order.data_item.content.surveyByTechnicianInfo.deadline
                      "
                        :textFieldProps="datetime.textFieldProps"
                        :date-picker-props="datetime.dateProps"
                        :time-picker-props="datetime.timeProps"
                        :disabled="true"
                        @input="getAssigneeDeadlineValue"
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
                </fieldset>
              </v-col>
            </v-row>
          </template>

          <!-- Images & Video -->
          <v-divider v-if="!isCreateNew" style="margin: 10px auto"></v-divider>
          <h3 v-if="!isCreateNew">Hình ảnh & video</h3>
          <v-row v-if="!isCreateNew && order.data_item.content.videoList !== ''">
            <v-col>
              <video width="500" controls>
                <source :src="order.data_item.content.videoList" />
              </video>
            </v-col>
          </v-row>
          <v-row v-if="!isCreateNew">
            <v-col
              v-for="(item, index) in order.data_item.content.imageList"
              :key="index"
              cols="auto"
            >
              <v-img contain width="400px" height="400px" :src="item"></v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>

    <!-- Show order timeline FAB -->
    <v-btn
      fab
      style="position: fixed; bottom: 20px; right: 20px;"
      color="warning"
      @click="openOrderTimeline"
    >
      <v-icon title="Xem tiến trình của đơn hàng" style="font-size: 18px;">mdi-format-list-bulleted</v-icon>
    </v-btn>
  </v-container>
</template>
<script>
import axios from "axios";
import UploadContractForm from "../components/orderDetail/uploadContract";
import UploadPriceQuoteForm from "../components/orderDetail/uploadPriceQuote";
import UploadPriceQuoteAgainForm from "../components/orderDetail/uploadPriceQuoteAgain";
import TechnicianSurveyForm from "../components/orderDetail/technicianSurvey";
import TechnicianTransferForm from "../components/orderDetail/technicianTransfer";
import OrderTimeline from "../components/orderDetail/orderTimeline";
import ShortUUID from "short-uuid";

export default {
  components: {
    UploadContractForm,
    TechnicianSurveyForm,
    UploadPriceQuoteForm,
    UploadPriceQuoteAgainForm,
    TechnicianTransferForm,
    OrderTimeline
  },
  data() {
    return {
      isAfterSurvey: "true",
      afterSurvey: false,
      showPriceQuoteForm: false,
      showPriceQuoteAgainForm: false,
      showUploadContractForm: false,
      showTechnicianSurveyForm: false,
      showTechnicianTransferForm: false,
      showOrderTimeline: false,
      selected: [],
      order: {
        data_item: {
          bucket: "crm_app_order",
          content: {
            linkContract: "",
            assignInfo: {
              assignDate: "",
              workDate: "",
              deadline: "",
              assigneeIDList: [],
              assignee: [],
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
            customerDirectContact: {
              name: "",
              phone: "",
              address: ""
            },
            deviceid: "",
            mobileChannel: "",
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
            quoteTime: "",
            surveyByTechnicianInfo: {
              assignee: {
                id: "",
                name: "",
                phone: ""
              },
              content: {}
            }
          },
          createdByDevice: "",
          creatingDate: "",
          description: "",
          id: ""
        },
        record_id: ""
      },
      technicians: [],
      chosenTechnicians: [],
      isNotCustomerDirectList: [
        {
          title: "Phải, chính là tôi",
          value: false
        },
        {
          title: "Không phải tôi",
          value: true
        }
      ],
      isHasContractList: [
        {
          title: "Có hợp đồng",
          value: true
        },
        {
          title: "Không có hợp đồng",
          value: false
        }
      ],
      services: [],
      oldListOfService: [],
      currentPaymentStatus: "",
      currentPaymentMethod: "",
      currentTechnician: "",
      isReadonly: true,
      isShowBaoGiaButton: true,
      isShowBaoGiaLaiButton: true,
      isShowKhaoSatButton: true,
      isShowChuyenGiaoButton: true,
      isShowSpecialButton: true,
      isCreateNew: false,
      isAssignInfoReadonly: false,
      isCustomerInfoReadonly: false,
      assignInfoCode: 0,
      isUpdate: false,
      isPayment: false,
      isConfirmNote: false,
      isSendContract: false,
      isSignContract: false,
      invoiceFormatToString: "",
      isNotCustomerDirectContact: "",
      isHasContract: "",
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
      },
      isActiveNoneDisplay: [],
      customerAddress: {
        province: "",
        district: "",
        ward: "",
        houseNumberAndStreetName: ""
      },
      addressInfo: {
        province_list: [],
        district_list: [],
        ward_list: []
      },
      currentProvince: "79",
      currentDistrict: "''",
      currentWard: "''",
      currentChosenServices: [],
      tempOrder: {
        data_item: {
          bucket: "crm_app_order",
          content: {
            linkContract: "",
            assignInfo: {
              assignDate: "",
              workDate: "",
              deadline: "",
              assigneeIDList: [],
              assignee: [],
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
            customerDirectContact: {
              name: "",
              phone: "",
              address: ""
            },
            deviceid: "",
            mobileChannel: "",
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
            quoteTime: "",
            surveyByTechnicianInfo: {
              assignee: {
                id: "",
                name: "",
                phone: ""
              },
              content: {}
            }
          },
          createdByDevice: "",
          creatingDate: "",
          description: "",
          id: ""
        },
        record_id: ""
      }
    };
  },
  watch: {
    isNotCustomerDirectContact: function(val) {
      if (!val) {
        // KHÔNG hiển thị form thông tin người liên hệ trực tiếp --> đã dùng v-show
      } else {
        // hiển thị form thông tin người liên hệ trực tiếp --> đã dùng v-show
        // xóa hết thông tin người liên hệ trực tiếp
        this.order.data_item.content.customerDirectContact.name = "";
        this.order.data_item.content.customerDirectContact.phone = "";
        this.order.data_item.content.customerDirectContact.address = "";
      }
    }
  },
  methods: {
    openOrderTimeline: function() {
      // get data before show dialog
      this.$store.dispatch("setOrderTimelineByID", this.order.record_id);

      // show dialog
      this.showOrderTimeline = true;
    },
    openTechnicianTransferDialog: function() {
      // set old & remaining technicians in order
      this.$store.dispatch("setOldAndRemainingTechnicians", this.order);

      // show dialog
      this.showTechnicianTransferForm = true;
    },
    showSurveyOrNot: function() {
      if (this.isAfterSurvey == "true") {
        this.convertOrderBySurvey();
      } else {
        this.reconvertOrderBySurvey();
      }
    },
    reconvertOrderBySurvey: function() {
      this.order = this.tempOrder;
    },
    convertOrderBySurvey: function() {
      // remember old order
      this.tempOrder = JSON.parse(JSON.stringify(this.order));

      // get order with survey
      this.order.data_item.content.imageList = this.tempOrder.data_item.content.surveyByTechnicianInfo.content.imageList;
      this.order.data_item.content.videoList = this.tempOrder.data_item.content.surveyByTechnicianInfo.content.videoList;
      this.order.data_item.content.orderValue = this.tempOrder.data_item.content.surveyByTechnicianInfo.content.orderValue;
      this.order.data_item.content.chosenServices = this.tempOrder.data_item.content.surveyByTechnicianInfo.content.chosenServices;
    },
    checkAuthentication: function() {
      let isLoggedIn = this.$store.getters.loggedIn;
      if (!isLoggedIn) {
        this.$store.dispatch("startReLogin");
      }
    },
    checkZeroInHead: function(event, index) {
      let numberValue = event.srcElement.value;
      let dotBefore = this.countCharacterInString(".", numberValue);
      let start = event.target.selectionStart;
      let end = event.target.selectionEnd;
      numberValue = numberValue.split(".").join("");
      while (numberValue.length > 1 && numberValue[0] == "0") {
        numberValue = numberValue.substring(1, numberValue.length);
        start -= 1;
        end -= 1;
      }
      numberValue = this.formartingNumberToCharge(numberValue);
      event.srcElement.value = numberValue;
      this.order.data_item.content.orderValue.details[
        index
      ].charge = numberValue;

      let dotAfter = this.countCharacterInString(".", numberValue);
      let distance = 0;
      if (dotBefore > dotAfter) {
        distance = dotBefore - dotAfter;
      }

      if (start - distance > 0) {
        event.target.selectionStart = start - distance;
      } else {
        event.target.selectionStart = 0;
      }
      if (end - distance > 0) {
        event.target.selectionEnd = end - distance;
      } else {
        event.target.selectionEnd = 0;
      }
    },
    countCharacterInString: function(c, str) {
      let result = 0;
      for (let i = 0; i < str.length; i++) {
        if (c == str[i]) {
          result += 1;
        }
      }
      return result;
    },
    handleDeleteNBackspace: function(event, index) {
      if (event.key == "Delete" || event.key == "Backspace") {
        event.preventDefault();

        let start = event.target.selectionStart;
        let end = event.target.selectionEnd;
        let numberValue = event.srcElement.value;

        switch (event.key) {
          case "Delete": {
            if (start == end) {
              if (start < numberValue.length) {
                // case: delete a character in the right
                if (numberValue[start] == ".") {
                  start += 1;
                  end += 1;
                }
                let head = numberValue.substring(0, start);
                let tail = numberValue.substring(start + 1, numberValue.length);
                let dotBefore = this.countCharacterInString(
                  ".",
                  numberValue.substring(0, start)
                );

                let result = head + "" + tail;
                result = result.split(".").join("");
                result = this.formartingNumberToCharge(result);
                event.srcElement.value = result;
                this.order.data_item.content.orderValue.details[
                  index
                ].charge = result;

                let headAfter = result.substring(0, start);
                let dotAfter = this.countCharacterInString(".", headAfter);

                let distance = 0;
                if (dotBefore > dotAfter) {
                  distance = 1;
                }

                event.target.selectionStart = start - distance;
                event.target.selectionEnd = end - distance;
              }
            } else {
              // case: delete all characters which is selected
              let head = numberValue.substring(0, start);
              let tail = numberValue.substring(end, numberValue.length);
              let dotBefore = this.countCharacterInString(".", head);

              let result = head + "" + tail;
              result = result.split(".").join("");
              result = this.formartingNumberToCharge(result);
              event.srcElement.value = result;
              this.order.data_item.content.orderValue.details[
                index
              ].charge = result;

              let headAfter = result.substring(0, start);
              let dotAfter = this.countCharacterInString(".", headAfter);

              let distance = 0;
              if (dotAfter < dotBefore) {
                distance = 1;
              }

              event.target.selectionStart = start - distance;
              event.target.selectionEnd = start - distance;
            }
            break;
          }
          case "Backspace": {
            if (start == end) {
              if (start > 0) {
                // case: delete a character in the left
                let dotBefore = this.countCharacterInString(".", numberValue);
                if (numberValue[start - 1] == ".") {
                  start -= 1;
                  end -= 1;
                }
                let head = numberValue.substring(0, start - 1);
                let tail = numberValue.substring(start, numberValue.length);

                let result = head + "" + tail;
                result = result.split(".").join("");
                result = this.formartingNumberToCharge(result);
                event.srcElement.value = result;
                this.order.data_item.content.orderValue.details[
                  index
                ].charge = result;

                let dotAfter = this.countCharacterInString(".", result);

                let distance = 1;
                if (dotBefore > dotAfter) {
                  distance = 2;
                }

                if (start - distance > 0) {
                  event.target.selectionStart = start - distance;
                } else {
                  event.target.selectionStart = 0;
                }
                if (end - distance > 0) {
                  event.target.selectionEnd = end - distance;
                } else {
                  event.target.selectionEnd = 0;
                }
              }
            } else {
              // case: delete all characters which is selected
              let head = numberValue.substring(0, start);
              let tail = numberValue.substring(end, numberValue.length);
              let dotBefore = this.countCharacterInString(".", head);

              let result = head + "" + tail;
              result = result.split(".").join("");
              result = this.formartingNumberToCharge(result);
              event.srcElement.value = result;
              this.order.data_item.content.orderValue.details[
                index
              ].charge = result;

              let headAfter = result.substring(0, start);
              let dotAfter = this.countCharacterInString(".", headAfter);

              let distance = dotAfter - dotBefore;
              if (distance < 0) {
                distance = 0;
              }

              event.target.selectionStart = start + distance;
              event.target.selectionEnd = start + distance;
            }
            break;
          }
        }
      }
    },
    formatServiceCharge: function(event, index) {
      event.preventDefault();
      var charCode = event.which ? event.which : event.keyCode;
      if (charCode >= 48 && charCode <= 57) {
        let start = event.target.selectionStart;
        let end = event.target.selectionEnd;
        let numberValue = event.srcElement.value;

        let head = numberValue.substring(0, start);
        let tail = numberValue.substring(end, numberValue.length);
        let dotBefore = this.countCharacterInString(".", numberValue);

        let tempStr = head + event.key + tail + "";

        let tempValue = tempStr.split(".").join("");
        tempValue = this.formartingNumberToCharge(tempValue);
        event.srcElement.value = tempValue;
        this.order.data_item.content.orderValue.details[
          index
        ].charge = tempValue;

        let dotAfter = this.countCharacterInString(".", tempValue);
        let distance = 1;
        if (dotAfter > dotBefore) {
          distance = 2;
        }

        event.target.selectionStart = start + distance;
        event.target.selectionEnd = start + distance;

        this.checkZeroInHead(event, index);
      }
    },
    deleteServiceCharge: function(event, index) {
      let tempValue = this.order.data_item.content.orderValue.details[index]
        .charge;
      tempValue = this.formatingChargeToNumber(tempValue);
      tempValue = tempValue + "";
      tempValue = this.formartingNumberToCharge(tempValue);
      this.order.data_item.content.orderValue.details[index].charge = tempValue;
    },
    serviceCheckboxClick: function(service) {
      let serviceID = service.id;
      let serviceName = service.name;

      if (!this.order.data_item.content.chosenServices.includes(serviceID)) {
        document.getElementById(serviceID).style.display = "block";
        this.order.data_item.content.chosenServices.push(serviceID);
        this.currentChosenServices.push(serviceName);
      } else {
        document.getElementById(serviceID).style.display = "none";
        this.order.data_item.content.chosenServices = this.order.data_item.content.chosenServices.filter(
          function(obj) {
            return obj !== serviceID;
          }
        );
        this.currentChosenServices = this.currentChosenServices.filter(function(
          obj
        ) {
          return obj !== serviceName;
        });
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

      result = arr[2] + "/"; // day
      result += this.getMonthDateTimeValue(arr[1]) + "/"; // month
      result += arr[3] + " "; // year
      result += arr[4]; // time
      return result;
    },
    getRequireDateTimeValue: function(datetimeValue) {
      this.order.data_item.content.expectedTime = this.formatDateTime(
        datetimeValue
      );
    },
    getPaymentDateTimeValue: function(datetimeValue) {
      this.order.data_item.content.paymentInfo.paymentDate = this.formatDateTime(
        datetimeValue
      );
    },
    getAssigneeWorkDateValue: function(datetimeValue) {
      this.order.data_item.content.assignInfo.workDate = this.formatDateTime(
        datetimeValue
      );
    },
    getAssigneeDeadlineValue: function(datetimeValue) {
      this.order.data_item.content.assignInfo.deadline = this.formatDateTime(
        datetimeValue
      );
    },
    getDetailService: function(record_id, index) {
      let chosenServices = this.order.data_item.content.chosenServices;
      if (!chosenServices.includes(record_id)) {
        // Case remove a service
        alert("remove");
      } else {
        // Case add a service
        alert("add");
      }
    },
    technicianChange: function() {
      if (this.currentTechnician == undefined) {
        return;
      }

      // Get technician info
      let arr = this.currentTechnician.split("-");
      let name = arr[0].trim();
      let phone = arr[1].trim();
      let found = this.technicians.find(
        element =>
          element.data_item.content.last_name +
            " " +
            element.data_item.content.first_name ==
            name && element.data_item.content.phone_number == phone
      );

      // push to chosen technicians array
      found.data_item.content.isTeamLeader = false;
      this.chosenTechnicians.push(found);

      // push technician id to assign info
      this.order.data_item.content.assignInfo.assigneeIDList.push(
        found.record_id
      );

      // remove found technicians in technicians array
      let foundPhoneNumber = found.record_id;
      let tempArr = this.technicians.filter(function(value) {
        return value.data_item.content.phone_number != foundPhoneNumber;
      });
      this.technicians = tempArr;
    },
    removeChosenTechnician: function(tempTechnician) {
      // remove an technician in chosenTechnicians array
      let foundPhoneNumber = tempTechnician.record_id;
      let tempArr = this.chosenTechnicians.filter(function(value) {
        return value.data_item.content.phone_number != foundPhoneNumber;
      });
      this.chosenTechnicians = tempArr;

      // remove technician id from assign info
      let foundID = tempTechnician.record_id;
      let tempArr2 = this.order.data_item.content.assignInfo.assigneeIDList.filter(
        function(value) {
          return value != foundID;
        }
      );
      this.order.data_item.content.assignInfo.assigneeIDList = tempArr2;

      // add tempTechnician to technicians array
      this.technicians.push(tempTechnician);

      // reset currentTechnician
      this.currentTechnician = "";
    },
    showToolbarButton: function() {
      let status = this.order.data_item.content.status;

      // Button hủy đơn hàng & pending
      if (status == "7" || status == "Đã hủy") {
        this.isShowSpecialButton = false;
        this.isShowBaoGiaButton = false;
        this.isShowBaoGiaLaiButton = false;
      } else {
        this.isShowSpecialButton = true;
        this.isShowBaoGiaButton = true;
        this.isShowBaoGiaLaiButton = true;
      }

      if (status == "5" || status == "Hoàn tất công việc, đã thanh toán") {
        this.isShowSpecialButton = false;
      }

      if (status == "3" || status == "6") {
        if (
          this.order.data_item.content.assignInfo.assigneeIDList.length == 0
        ) {
          status = "Đã chốt, chưa phân công";
        }
      }

      // Button báo giá
      switch (status) {
        case "0":
        case "Chưa tiếp nhận":
          this.isShowKhaoSatButton = true;
          this.isShowBaoGiaButton = false;
          this.isShowBaoGiaLaiButton = false;
          this.isShowChuyenGiaoButton = false;
          break;
        case "0b":
        case "Đã khảo sát":
          this.isShowKhaoSatButton = false;
          this.isShowBaoGiaButton = true;
          this.isShowBaoGiaLaiButton = false;
          this.isShowChuyenGiaoButton = false;
          this.afterSurvey = true;
          this.convertOrderBySurvey();
          break;
        case "1a":
        case "Cần báo giá lại":
          this.isShowKhaoSatButton = false;
          this.isShowBaoGiaButton = false;
          this.isShowBaoGiaLaiButton = true;
          this.isShowChuyenGiaoButton = false;
          break;
        case "2":
        case "Phản hồi, cần edit":
          // Hidden button báo giá
          this.isShowBaoGiaButton = false;
          this.isShowKhaoSatButton = false;
          this.isShowBaoGiaLaiButton = false;
          this.isShowChuyenGiaoButton = false;

          // Note
          if (this.order.data_item.content.note !== "") {
            this.isConfirmNote = true;
          } else {
            this.isConfirmNote = false;
          }
          break;
        case "2a":
        case "Chưa gửi hợp đồng":
          // Hidden button báo giá
          this.isShowBaoGiaButton = false;
          this.isShowKhaoSatButton = false;
          this.isShowBaoGiaLaiButton = false;
          this.isShowChuyenGiaoButton = false;

          // Display button confirm sending contract
          this.isSendContract = true;
          break;
        case "2b":
        case "Đã gửi HĐ, chưa phản hồi":
          // Hidden button báo giá
          this.isShowBaoGiaButton = false;
          this.isShowKhaoSatButton = false;
          this.isShowBaoGiaLaiButton = false;
          this.isShowChuyenGiaoButton = false;

          // Display button confirm sign contract
          this.isSignContract = true;
          break;
        case "3":
        case "Chưa xong việc, chưa thanh toán":
        case "6":
        case "Chưa xong việc, đã thanh toán":
          // Hidden button báo giá
          this.isShowBaoGiaButton = false;
          this.isShowKhaoSatButton = false;
          this.isShowBaoGiaLaiButton = false;
          this.isShowChuyenGiaoButton = true;
          break;
        default:
          this.isShowBaoGiaLaiButton = false;
          this.isShowBaoGiaButton = false;
          this.isShowKhaoSatButton = false;
          this.isShowChuyenGiaoButton = false;
      }
    },
    checkIsReadonly: function() {
      let status = this.order.data_item.content.status;
      switch (status) {
        case "0":
        case "0b":
        case "1a":
          this.isReadonly = false;
          break;
        case "0a":
          this.isReadonly = true;
          this.isCustomerInfoReadonly = true;
          break;
        case "2":
          if (this.order.data_item.content.paymentInfo.status === "1") {
            this.isReadonly = true;
            this.isCustomerInfoReadonly = true;
          } else {
            this.isCustomerInfoReadonly = false;
            this.isReadonly = false;
          }
          break;
        default:
          this.isReadonly = true;
      }
    },
    checkIsAssignInfoReadonly: function() {
      let status = this.order.data_item.content.status;
      switch (status) {
        case "0":
        case "0a":
        case "0b":
        case "1a":
        case "1":
        case "2":
          this.assignInfoCode = 0;
          this.isAssignInfoReadonly = true;
          break;
        case "2c":
        case "3":
        case "6":
          if (
            this.order.data_item.content.assignInfo.assigneeIDList.length === 0
          ) {
            this.assignInfoCode = 1;
            this.isUpdate = true;
            this.isAssignInfoReadonly = false;
          } else {
            this.assignInfoCode = 1;
            this.isUpdate = false;
            this.isAssignInfoReadonly = true;
          }
          break;
        case "4":
        case "5":
        case "7":
        case "8":
          this.assignInfoCode = 2;
          this.isAssignInfoReadonly = true;
          break;
        default:
          this.isAssignInfoReadonly = false;
      }
    },
    checkIsCustomerInfoReadonly: function() {
      let status = this.order.data_item.content.status;
      switch (status) {
        case "0":
        case "0b":
        case "1a":
          this.isCustomerInfoReadonly = false;
          break;
        case "0a":
          this.isReadonly = true;
          this.isCustomerInfoReadonly = true;
          break;
        case "2":
          if (this.order.data_item.content.note !== "") {
            this.isCustomerInfoReadonly = false;
            this.isReadonly = true;
          }
          break;
        default:
          this.isCustomerInfoReadonly = true;
      }
    },
    checkIsPayment: function() {
      if (this.order.data_item.content.status === "2") {
        if (this.order.data_item.content.paymentInfo.status === "1") {
          this.isPayment = true;
        }
      }
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
    getCurrentDateTime: function() {
      let today = new Date();
      let hours = today.getHours();
      let minutes = today.getMinutes();
      let seconds = today.getSeconds();
      let years = today.getFullYear();
      let months = today.getMonth() + 1;
      let days = today.getDate();

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (months < 10) {
        months = "0" + months;
      }
      if (days < 10) {
        days = "0" + days;
      }

      let time = hours + ":" + minutes + ":" + seconds;
      let date = days + "/" + months + "/" + years;
      let result = date + " " + time;

      return result;
    },
    getCustomerAddressProvince: function() {
      for (let i = 0; i < this.addressInfo.province_list.length; i++) {
        if (
          this.addressInfo.province_list[i].province_code ==
          this.currentProvince
        ) {
          return this.addressInfo.province_list[i].province_name;
        }
      }
    },
    getCustomerAddressDistrict: function() {
      for (let i = 0; i < this.addressInfo.district_list.length; i++) {
        if (
          this.addressInfo.district_list[i].district_code ==
          this.currentDistrict
        ) {
          return this.addressInfo.district_list[i].district_name;
        }
      }
    },
    getCustomerAddressWard: function() {
      for (let i = 0; i < this.addressInfo.ward_list.length; i++) {
        if (this.addressInfo.ward_list[i].ward_code == this.currentWard) {
          return this.addressInfo.ward_list[i].ward_name;
        }
      }
    },
    getAssigneeList: function() {
      for (let i = 0; i < this.chosenTechnicians.length; i++) {
        let temp = {
          id: this.chosenTechnicians[i].record_id,
          name:
            this.chosenTechnicians[i].data_item.content.last_name +
            " " +
            this.chosenTechnicians[i].data_item.content.first_name,
          phone: this.chosenTechnicians[i].data_item.content.phone_number,
          isTeamLeader: this.chosenTechnicians[i].data_item.content.isTeamLeader
        };
        this.order.data_item.content.assignInfo.assignee.push(temp);
      }
    },
    prepareData: function() {
      // creating date
      if (this.isCreateNew) {
        this.order.data_item.creatingDate = this.getCurrentDateTime();
      }

      // Chosen Service
      if (this.isCreateNew) {
        let newDetails = [];
        let details = this.order.data_item.content.orderValue.details;
        for (let i = 0; i < details.length; i++) {
          if (document.getElementById(details[i].id).style.display == "block") {
            newDetails.push(details[i]);
          }
        }
        this.order.data_item.content.orderValue.details = newDetails;
      }

      // .. customer & direct contact person: address info
      // .. require info: has a contract or not
      if (this.isCreateNew) {
        // direct contact person
        this.customerAddress.ward = this.getCustomerAddressWard();
        this.customerAddress.district = this.getCustomerAddressDistrict();
        this.customerAddress.province = this.getCustomerAddressProvince();
        this.order.data_item.content.customerInfo.address =
          this.customerAddress.houseNumberAndStreetName +
          ", " +
          this.customerAddress.ward +
          ", " +
          this.customerAddress.district +
          ", " +
          this.customerAddress.province;
        if (!this.isNotCustomerDirectContact) {
          // gán thông tin khách hàng vào người liên hệ trực tiếp
          this.order.data_item.content.customerDirectContact.name = this.order.data_item.content.customerInfo.name;
          this.order.data_item.content.customerDirectContact.phone = this.order.data_item.content.customerInfo.phone;
          this.order.data_item.content.customerDirectContact.address = this.order.data_item.content.customerInfo.address;
        }

        // has a contract or not
        if (this.isHasContract) {
          // loại đặt lịch có hợp đồng
          this.order.data_item.content.hasContract = "1";
          this.order.data_item.content.paymentInfo.paymentMethod = "0";
        } else {
          // loại đặt lịch không có hợp đồng
          this.order.data_item.content.hasContract = "0";
        }
      }

      // payment info
      if (this.isCreateNew) {
        this.order.data_item.content.paymentInfo.status = "0";
        this.order.data_item.content.paymentInfo.paymentMethod = "0";
        this.order.data_item.content.paymentInfo.paymentDate = "";
        this.order.data_item.content.paymentInfo.invoice = {};
        this.currentPaymentStatus = "Chưa thanh toán";
        this.currentPaymentMethod = "Tiền mặt";
      }
    },

    // Push notification - version1: firebase
    prepareHuyDonData: function() {
      let deviceStr = this.order.data_item.content.deviceid.split(";");
      let deviceID = deviceStr[0];
      let result = {
        data: {
          title: "Đã hủy đơn hàng",
          body:
            "Đơn hàng đặt ngày" +
            this.order.data_item.creatingDate +
            " đã được SAFE HOUSE hủy",
          notId: 1,
          action: "billing",
          order: this.order.data_item,
          "content-available": "1",
          isNew: "1"
        },
        to: deviceID
      };
      return result;
    },
    pushHuyDonNotificationToMobile: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let url = "https://fcm.googleapis.com/fcm/send";
      this.prepareData();
      let data = this.prepareHuyDonData();
      data = JSON.parse(JSON.stringify(data));
      // data.data.order.content.status = "7";
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "key=AAAALDFKytY:APA91bFaoY0LJutqy8WR9oZQe0mZUQv2-ltzIz2qt5uhW3Xh-axuBOuI249gfLL5OBIz7cooOWLFR0gTbAEKJs3Pq9DZ7-6ExmSK7OgAII-xESopuiM1QLTCnvMwBHvOeNx_DlbvPg0p"
        }
      };

      axios
        .post(url, data, config)
        .then(response => {
          let respData = response.data;
          if (respData.success == 1) {
            this.order.data_item.content.status = "7";
            this.isShowBaoGiaButton = false;
            this.isShowSpecialButton = false;
            this.isPayment = false;
            this.isUpdate = false;
            this.isConfirmNote = false;
            this.isReadonly = true;
            this.isAssignInfoReadonly = true;
            this.isCustomerInfoReadonly = true;
            this.$notify({
              group: "notifications",
              title: "THÀNH CÔNG",
              text: "Đã gửi thông báo cho khách hàng",
              type: "success",
              width: "400px"
            });
          } else {
            this.$notify({
              group: "notifications",
              title: "HỆ THỐNG",
              text: "Không gửi được thông báo cho khách hàng",
              type: "warning",
              width: "400px"
            });
          }
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            group: "notifications",
            title: "HỆ THỐNG",
            text: "Không gửi được thông báo cho khách hàng",
            type: "warning",
            width: "400px"
          });
        });
    },
    prepareDaGuiHopDongData: function() {
      let deviceStr = this.order.data_item.content.deviceid.split(";");
      let deviceID = deviceStr[0];

      if (deviceStr[1] == "ANDROID") {
        let result = {
          data: {
            badge: 1,
            title: "Đã gửi hợp đồng",
            body:
              "SAFE HOUSE đã gửi hợp đồng đến Quý khách.  Xin vui lòng phản hồi thông tin sớm nhất cho chúng tôi",
            notId: 1,
            action: "contract",
            order: {
              id: this.order.data_item.id
            },
            "content-available": "1",
            isNew: "1"
          },
          to: deviceID
        };
        return result;
      } else {
        let result = {
          notification: {
            title: "Đã gửi hợp đồng",
            body:
              "SAFE HOUSE đã gửi hợp đồng đến Quý khách.  Xin vui lòng phản hồi thông tin sớm nhất cho chúng tôi",
            clickAction: "FCM_PLUGIN_ACTIVITY",
            badge: 1
          },
          data: {
            title: "Đã gửi hợp đồng",
            body:
              "SAFE HOUSE đã gửi hợp đồng đến Quý khách.  Xin vui lòng phản hồi thông tin sớm nhất cho chúng tôi",
            notId: 1,
            action: "contract",
            order: {
              id: this.order.data_item.id
            },
            "content-available": "1",
            isNew: "1"
          },
          to: deviceID,
          priority: "high",
          content_available: true
        };
        return result;
      }
    },
    pushDaGuiHopDongNotificationToMobile: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let url = "https://fcm.googleapis.com/fcm/send";
      this.prepareData();
      let data = this.prepareDaGuiHopDongData();
      data = JSON.parse(JSON.stringify(data));
      // data.data.order.content.status = "2b";
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "key=AAAALDFKytY:APA91bFaoY0LJutqy8WR9oZQe0mZUQv2-ltzIz2qt5uhW3Xh-axuBOuI249gfLL5OBIz7cooOWLFR0gTbAEKJs3Pq9DZ7-6ExmSK7OgAII-xESopuiM1QLTCnvMwBHvOeNx_DlbvPg0p"
        }
      };

      axios
        .post(url, data, config)
        .then(response => {
          let respData = response.data;
          if (respData.success == 1) {
            this.isSendContract = false;
            this.isSignContract = true;
            this.order.data_item.content.status = "2b";
            this.$notify({
              group: "notifications",
              title: "THÀNH CÔNG",
              text: "Đã gửi thông báo cho khách hàng",
              type: "success",
              width: "400px"
            });
          } else {
            this.$notify({
              group: "notifications",
              title: "HỆ THỐNG",
              text: "Không gửi được thông báo cho khách hàng",
              type: "warning",
              width: "400px"
            });
          }
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            group: "notifications",
            title: "HỆ THỐNG",
            text: "Không gửi được thông báo cho khách hàng",
            type: "warning",
            width: "400px"
          });
        });
    },
    preparePhanCongData: function() {
      let deviceStr = this.order.data_item.content.deviceid.split(";");
      let deviceID = deviceStr[0];
      let result = {
        data: {
          title: "Đã phân công",
          body:
            "Đơn hàng đặt ngày" +
            this.order.data_item.creatingDate +
            " đã được phân công xử lý",
          notId: 1,
          action: "billing",
          order: {
            id: this.order.data_item.id
          },
          "content-available": "1",
          isNew: "1"
        },
        to: deviceID
      };
      return result;
    },
    pushPhanCongNotificationToMobile: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let url = "https://fcm.googleapis.com/fcm/send";
      this.prepareData();
      let data = this.preparePhanCongData();
      data = JSON.parse(JSON.stringify(data));
      // data.data.order.content.status = "3";
      // if (data.data.order.content.status == "Chưa xong việc, đã thanh toán") {
      //   data.data.order.content.status = "6";
      // }
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "key=AAAALDFKytY:APA91bFaoY0LJutqy8WR9oZQe0mZUQv2-ltzIz2qt5uhW3Xh-axuBOuI249gfLL5OBIz7cooOWLFR0gTbAEKJs3Pq9DZ7-6ExmSK7OgAII-xESopuiM1QLTCnvMwBHvOeNx_DlbvPg0p"
        }
      };

      axios
        .post(url, data, config)
        .then(response => {
          let respData = response.data;
          if (respData.success == 1) {
            this.isReadonly = true;
            this.isAssignInfoReadonly = true;
            this.isCustomerInfoReadonly = true;
            this.isUpdate = false;
            this.$notify({
              group: "notifications",
              title: "THÀNH CÔNG",
              text: "Đã gửi thông báo cho khách hàng",
              type: "success",
              width: "400px"
            });
          } else {
            this.$notify({
              group: "notifications",
              title: "HỆ THỐNG",
              text: "Không gửi được thông báo cho khách hàng",
              type: "warning",
              width: "400px"
            });
          }
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            group: "notifications",
            title: "HỆ THỐNG",
            text: "Không gửi được thông báo cho khách hàng",
            type: "warning",
            width: "400px"
          });
        });
    },
    prepareBaoGiaData: function() {
      let deviceStr = this.order.data_item.content.deviceid.split(";");
      let deviceID = deviceStr[0];

      if (deviceStr[1] == "ANDROID") {
        let result = {
          data: {
            badge: 1,
            title: "Báo giá mới",
            body:
              "SAFE HOUSE đã gửi bảng báo giá đến Quý khách.  Xin vui lòng phản hồi thông tin sớm nhất cho chúng tôi.",
            notId: 1,
            action: "billing",
            order: {
              id: this.order.data_item.id
            },
            "content-available": "1",
            isNew: "1"
          },
          to: deviceID
        };
        return result;
      } else {
        let result = {
          notification: {
            title: "Báo giá mới",
            body:
              "SAFE HOUSE đã gửi bảng báo giá đến Quý khách.  Xin vui lòng phản hồi thông tin sớm nhất cho chúng tôi.",
            clickAction: "FCM_PLUGIN_ACTIVITY",
            badge: 1
          },
          data: {
            title: "Báo giá mới",
            body:
              "SAFE HOUSE đã gửi bảng báo giá đến Quý khách.  Xin vui lòng phản hồi thông tin sớm nhất cho chúng tôi.",
            notId: 1,
            action: "billing",
            order: {
              id: this.order.data_item.id
            },
            "content-available": "1",
            isNew: "1"
          },
          to: deviceID,
          priority: "high",
          content_available: true
        };
        return result;
      }
    },
    pushBaoGiaNotificationToMobile: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let url = "https://fcm.googleapis.com/fcm/send";
      this.prepareData();
      let data = this.prepareBaoGiaData();
      data = JSON.parse(JSON.stringify(data));
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "key=AAAALDFKytY:APA91bFaoY0LJutqy8WR9oZQe0mZUQv2-ltzIz2qt5uhW3Xh-axuBOuI249gfLL5OBIz7cooOWLFR0gTbAEKJs3Pq9DZ7-6ExmSK7OgAII-xESopuiM1QLTCnvMwBHvOeNx_DlbvPg0p"
        }
      };

      axios
        .post(url, data, config)
        .then(response => {
          let respData = response.data;
          if (respData.success == 1) {
            this.isCreateNew = false;
            this.isShowBaoGiaButton = false;
            this.isReadonly = true;
            this.isCustomerInfoReadonly = true;
            this.order.data_item.content.status = "1";
            this.afterSurvey = false;
            this.$notify({
              group: "notifications",
              title: "THÀNH CÔNG",
              text: "Đã gửi báo giá cho khách hàng",
              type: "success",
              width: "400px"
            });
          } else {
            this.$notify({
              group: "notifications",
              title: "HỆ THỐNG",
              text: "Không gửi được báo giá cho khách hàng",
              type: "warning",
              width: "400px"
            });
          }
        })
        .catch(e => {
          debugger;
          console.log(e);
          this.$notify({
            group: "notifications",
            title: "HỆ THỐNG",
            text: "Không gửi được báo giá cho khách hàng",
            type: "warning",
            width: "400px"
          });
        });
    },
    prepareBaoGiaLaiData: function() {
      let deviceStr = this.order.data_item.content.deviceid.split(";");
      let deviceID = deviceStr[0];

      if (deviceStr[1] == "ANDROID") {
        let result = {
          data: {
            badge: 1,
            title:
              "Báo giá lại lần " + this.order.data_item.content.priceQuoteTimes,
            body:
              "Báo giá lại lần " +
              this.order.data_item.content.priceQuoteTimes +
              " cho đơn hàng đặt ngày " +
              this.order.data_item.creatingDate,
            notId: 1,
            action: "billing",
            order: {
              id: this.order.data_item.id
            },
            "content-available": "1",
            isNew: "1"
          },
          to: deviceID
        };
        return result;
      } else {
        let result = {
          notification: {
            title:
              "Báo giá lại lần " + this.order.data_item.content.priceQuoteTimes,
            body:
              "Báo giá lại lần " +
              this.order.data_item.content.priceQuoteTimes +
              " cho đơn hàng đặt ngày " +
              this.order.data_item.creatingDate,
            clickAction: "FCM_PLUGIN_ACTIVITY",
            badge: 1
          },
          data: {
            title:
              "Báo giá lại lần " + this.order.data_item.content.priceQuoteTimes,
            body:
              "Báo giá lại lần " +
              this.order.data_item.content.priceQuoteTimes +
              " cho đơn hàng đặt ngày " +
              this.order.data_item.creatingDate,
            notId: 1,
            action: "billing",
            order: {
              id: this.order.data_item.id
            },
            "content-available": "1",
            isNew: "1"
          },
          to: deviceID,
          priority: "high",
          content_available: true
        };
        return result;
      }
    },
    pushBaoGiaLaiNotificationToMobile: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let url = "https://fcm.googleapis.com/fcm/send";
      this.prepareData();
      let data = this.prepareBaoGiaLaiData();
      data = JSON.parse(JSON.stringify(data));
      // data.data.order.content.status = "1";
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "key=AAAALDFKytY:APA91bFaoY0LJutqy8WR9oZQe0mZUQv2-ltzIz2qt5uhW3Xh-axuBOuI249gfLL5OBIz7cooOWLFR0gTbAEKJs3Pq9DZ7-6ExmSK7OgAII-xESopuiM1QLTCnvMwBHvOeNx_DlbvPg0p"
        }
      };

      axios
        .post(url, data, config)
        .then(response => {
          let respData = response.data;
          if (respData.success == 1) {
            this.isCreateNew = false;
            this.isShowBaoGiaButton = false;
            this.isReadonly = true;
            this.isCustomerInfoReadonly = true;
            this.order.data_item.content.status = "1";
            this.afterSurvey = false;
            this.$notify({
              group: "notifications",
              title: "THÀNH CÔNG",
              text: "Đã gửi báo giá cho khách hàng",
              type: "success",
              width: "400px"
            });
          } else {
            this.$notify({
              group: "notifications",
              title: "HỆ THỐNG",
              text: "Không gửi được báo giá cho khách hàng",
              type: "warning",
              width: "400px"
            });
          }
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            group: "notifications",
            title: "HỆ THỐNG",
            text: "Không gửi được báo giá cho khách hàng",
            type: "warning",
            width: "400px"
          });
        });
    },

    // Push notification - version 2: centrifuge in Baas project
    pushHuyDonNotificationToMobile2: function() {
      // let deviceStr = this.order.data_item.content.deviceid.split(";");
      // let deviceID = deviceStr[0];

      let mobileChannel = this.order.data_item.content.mobileChannel;

      let message = {
        from: "crm",
        to: "mobile",
        datetime: this.getCurrentDateTime(),
        content: {
          // mobileChannel: deviceID,
          mobileChannel: mobileChannel,
          currentOrderStatus: "7",
          orderID: this.order.record_id,
          msg:
            "Đơn hàng đặt ngày" +
            this.order.data_item.creatingDate +
            " đã được SAFE HOUSE hủy"
        },
        isNew: "1"
      };

      this.$store
        .dispatch("pushNotification", message)
        .then(response => {
          this.order.data_item.content.status = "7";
          this.isShowBaoGiaButton = false;
          this.isShowSpecialButton = false;
          this.isPayment = false;
          this.isUpdate = false;
          this.isConfirmNote = false;
          this.isReadonly = true;
          this.isAssignInfoReadonly = true;
          this.isCustomerInfoReadonly = true;
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Đã gửi thông báo cho khách hàng",
            type: "success",
            width: "400px"
          });
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            group: "notifications",
            title: "HỆ THỐNG",
            text: "Không gửi được thông báo cho khách hàng",
            type: "warning",
            width: "400px"
          });
        });
    },
    pushDaGuiHopDongNotificationToMobile2: function() {
      // let deviceStr = this.order.data_item.content.deviceid.split(";");
      // let deviceID = deviceStr[0];

      let mobileChannel = this.order.data_item.content.mobileChannel;

      let message = {
        from: "crm",
        to: "mobile",
        datetime: this.getCurrentDateTime(),
        content: {
          // mobileChannel: deviceID,
          mobileChannel: mobileChannel,
          currentOrderStatus: "2b",
          orderID: this.order.record_id,
          msg:
            "SAFE HOUSE đã gửi hợp đồng đến Quý khách.  Xin vui lòng phản hồi thông tin sớm nhất cho chúng tôi"
        },
        isNew: "1"
      };

      this.$store
        .dispatch("pushNotification", message)
        .then(response => {
          this.isSendContract = false;
          this.isSignContract = true;
          this.order.data_item.content.status = "2b";
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Đã gửi thông báo cho khách hàng",
            type: "success",
            width: "400px"
          });
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            group: "notifications",
            title: "HỆ THỐNG",
            text: "Không gửi được thông báo cho khách hàng",
            type: "warning",
            width: "400px"
          });
        });
    },
    pushPhanCongNotificationToMobile2: function() {
      // let deviceStr = this.order.data_item.content.deviceid.split(";");
      // let deviceID = deviceStr[0];

      let mobileChannel = this.order.data_item.content.mobileChannel;

      let currentOrderStatus = "3";
      if (
        this.order.data_item.content.status == "Chưa xong việc, đã thanh toán"
      ) {
        currentOrderStatus = "6";
      }

      let message = {
        from: "crm",
        to: "mobile",
        datetime: this.getCurrentDateTime(),
        content: {
          // mobileChannel: deviceID,
          mobileChannel: mobileChannel,
          currentOrderStatus: currentOrderStatus,
          orderID: this.order.record_id,
          msg:
            "Đơn hàng đặt ngày" +
            this.order.data_item.creatingDate +
            " đã được phân công xử lý"
        },
        isNew: "1"
      };

      this.$store
        .dispatch("pushNotification", message)
        .then(response => {
          this.isReadonly = true;
          this.isAssignInfoReadonly = true;
          this.isCustomerInfoReadonly = true;
          this.isUpdate = false;
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Đã gửi thông báo cho khách hàng",
            type: "success",
            width: "400px"
          });
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            group: "notifications",
            title: "HỆ THỐNG",
            text: "Không gửi được thông báo cho khách hàng",
            type: "warning",
            width: "400px"
          });
        });
    },
    pushBaoGiaNotificationToMobile2: function() {
      // let deviceStr = this.order.data_item.content.deviceid.split(";");
      // let deviceID = deviceStr[0];

      let mobileChannel = this.order.data_item.content.mobileChannel;

      let message = {
        from: "crm",
        to: "mobile",
        datetime: this.getCurrentDateTime(),
        content: {
          // mobileChannel: deviceID,
          mobileChannel: mobileChannel,
          currentOrderStatus: "1",
          orderID: this.order.record_id,
          msg:
            "SAFE HOUSE đã gửi bảng báo giá đến Quý khách.  Xin vui lòng phản hồi thông tin sớm nhất cho chúng tôi."
        },
        isNew: "1"
      };

      this.$store
        .dispatch("pushNotification", message)
        .then(response => {
          this.isCreateNew = false;
          this.isShowBaoGiaButton = false;
          this.isReadonly = true;
          this.isCustomerInfoReadonly = true;
          this.order.data_item.content.status = "1";
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Đã gửi báo giá cho khách hàng",
            type: "success",
            width: "400px"
          });
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            group: "notifications",
            title: "HỆ THỐNG",
            text: "Không gửi được báo giá cho khách hàng",
            type: "warning",
            width: "400px"
          });
        });
    },
    pushKhaoSatNotificationToMobile2: function() {
      let mobileChannel = this.order.data_item.content.mobileChannel;

      let message = {
        from: "crm",
        to: "mobile",
        datetime: this.getCurrentDateTime(),
        content: {
          // mobileChannel: deviceID,
          mobileChannel: mobileChannel,
          currentOrderStatus: "0a",
          orderID: this.order.record_id,
          msg:
            "Đơn hàng đặt ngày " +
            this.order.data_item.creatingDate +
            " đã phân công kỹ thuật viên thực hiện khảo sát"
        },
        isNew: "1"
      };

      this.$store
        .dispatch("pushNotification", message)
        .then(response => {
          this.isCreateNew = false;
          this.isShowBaoGiaButton = false;
          this.isShowKhaoSatButton = false;
          this.isReadonly = true;
          this.isCustomerInfoReadonly = true;
          this.order.data_item.content.status = "0a";
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            group: "notifications",
            title: "HỆ THỐNG",
            text: "Không gửi được báo giá cho khách hàng",
            type: "warning",
            width: "400px"
          });
        });
    },

    // ... helpers
    increaseTechnicianTask: function() {
      // increase current task
      let currentTask = this.chosenTechnician.data_item.content
        .progressingTasks;
      let data = 1 + +currentTask;
      data = '"' + data + '"';

      // call api update
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_technician";
      let record = this.chosenTechnician.record_id;
      let api =
        "/api/core/v1/data/update_one/" +
        bucket +
        "/" +
        record +
        "/content/progressingTasks";
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      // cách gọi api này làm data gửi theo dạng form data --> backend báo sai định dạng
      // axios
      //   .patch(url, data, config)
      //   .then(response => {})
      //   .catch(e => {});

      // Đây là cách gọi để fix vấn đề bên trên (data là text) --> nhưng chưa chạy thử
      // axios({
      //   url: url,
      //   method: patch,
      //   data: data,
      //   config: config
      // })
      //   .then(response => {})
      //   .catch(e => {});
    },
    decreaseTechnicianTask: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      // found technician
      let technicianID = this.order.data_item.content.assignInfo.assignee.id;
      if (technicianID === "") return;
      let foundTechnician = this.technicians.find(
        element => element.data_item.content.id == technicianID
      );

      // decrease current task
      let currentTask = foundTechnician.data_item.content.progressingTasks;
      let data = +currentTask - 1;

      // call api update
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_technician";
      let record = foundTechnician.record_id;
      let api =
        "/api/core/v1/data/update_one/" +
        bucket +
        "/" +
        record +
        "/content/progressingTasks";
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      axios
        .patch(url, data, config)
        .then(response => {})
        .catch(e => {});
    },
    getGenerateOrderID: function() {
      return new Promise((resolve, reject) => {
        //Instantiate
        let alphabet = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890";
        const uid = new ShortUUID(alphabet);

        // Random UUID
        let result = uid.new();
        resolve(result);
      });
    },
    // getGenerateOrderID: function() {
    //   return new Promise((resolve, reject) => {
    //     let uuid = this.$uuid.v1();
    //     uuid = uuid.split("-").join("_");
    //     resolve(uuid);
    //   });
    // },
    // getGenerateOrderID: function() {
    //   // Check Authentication
    //   this.checkAuthentication();

    //   // Handle
    //   return new Promise((resolve, reject) => {
    //     let serverDomain = this.$store.getters.serverDomain;
    //     let url = serverDomain + "/api/facicare/v1/order/generate_id";
    //     let data = {
    //       service_name: this.order.data_item.content.chosenServices
    //     };
    //     let config = {
    //       headers: this.$store.getters.getAuthConfig
    //     };

    //     axios
    //       .post(url, data, config)
    //       .then(res => {
    //         resolve(res);
    //       })
    //       .catch(e => {
    //         reject(e);
    //       });
    //   });
    // },
    // generateOrderID: function(serviceArr) {
    //   return serviceArr.join("_");
    // },

    // Các hàm validate dữ liệu
    isValidAssign: function() {
      // validate input info or not
      let assigneeIDListLength = this.order.data_item.content.assignInfo
        .assigneeIDList.length;
      let assigneeWorkDate = this.order.data_item.content.assignInfo.assignee
        .workDate;
      let assigneeDeadline = this.order.data_item.content.assignInfo.assignee
        .deadline;
      if (
        assigneeIDListLength == 0 ||
        assigneeWorkDate === "" ||
        assigneeDeadline === ""
      ) {
        return false;
      }

      // a Team must have only an team leader
      let teamLeaderCounter = 0;
      for (let i = 0; i < this.chosenTechnicians.length; i++) {
        let isTeamLeader = this.chosenTechnicians[i].data_item.content
          .isTeamLeader;
        if (isTeamLeader) {
          teamLeaderCounter++;
        }
      }
      if (teamLeaderCounter == 0 || teamLeaderCounter > 1) {
        return false;
      }

      return true;
    },
    customerInfoValidating: function() {
      let validResult = {
        valid: true,
        msg: ""
      };

      // if (this.order.data_item.content.customerInfo.id == "") {
      //   validResult.valid = false;
      //   validResult.msg = "Bạn chưa nhập ID của khách hàng";
      //   return validResult;
      // }
      if (this.order.data_item.content.customerInfo.name == "") {
        validResult.valid = false;
        validResult.msg = "Bạn chưa nhập tên của khách hàng";
        return validResult;
      }
      if (this.order.data_item.content.customerInfo.phone == "") {
        validResult.valid = false;
        validResult.msg = "Bạn chưa nhập số điện thoại của khách hàng";
        return validResult;
      }
      if (
        this.currentDistrict == "''" ||
        this.currentWard == "''" ||
        this.customerAddress.houseNumberAndStreetName == ""
      ) {
        validResult.valid = false;
        validResult.msg = "Bạn chưa nhập địa chỉ của khách hàng";
        return validResult;
      }
      if (this.isNotCustomerDirectContact.length == 0) {
        validResult.valid = false;
        validResult.msg = "Bạn chưa cho biết người liên hệ trực tiếp";
        console.log(this.isNotCustomerDirectContact);
        return validResult;
      }
      if (this.isNotCustomerDirectContact) {
        if (
          this.order.data_item.content.customerDirectContact.name == "" ||
          this.order.data_item.content.customerDirectContact.phone == "" ||
          this.order.data_item.content.customerDirectContact.address == ""
        ) {
          validResult.valid = false;
          validResult.msg =
            "Bạn chưa điền đầy đủ thông tin người liên hệ trực tiếp";
          return validResult;
        }
      }

      return validResult;
    },
    requireInfoValidating: function() {
      let validResult = {
        valid: true,
        msg: ""
      };

      if (this.order.data_item.content.expectedTime == "") {
        validResult.valid = false;
        validResult.msg = "Bạn chưa chọn giờ làm việc";
        return validResult;
      }
      if (this.order.data_item.content.expectedAddress == "") {
        validResult.valid = false;
        validResult.msg = "Bạn chưa nhập địa điểm làm việc";
        return validResult;
      }
      if (this.isHasContract.length == 0) {
        validResult.valid = false;
        validResult.msg = "Bạn chưa chọn loại đặt lịch";
        return validResult;
      }

      return validResult;
    },
    paymentInfoValidating: function() {
      let validResult = {
        valid: true,
        msg: ""
      };

      // payment info with hasContract option value is "1"
      if (this.isCreateNew) {
        if (this.order.data_item.content.paymentInfo.status == "1") {
          validResult.valid = false;
          validResult.msg = "Không thể thanh toán trong lúc tạo mới đơn hàng";
          return validResult;
        }
        if (this.isHasContract) {
          if (this.currentPaymentMethod == "Thẻ") {
            validResult.valid = false;
            validResult.msg =
              "Không thể thanh toán bằng thẻ với loại đặt lịch có hợp đồng";
            return validResult;
          }
        }
      }

      if (this.currentPaymentStatus == "") {
        validResult.valid = false;
        validResult.msg = "Bạn chưa nhập trạng thái thanh toán";
        return validResult;
      } else if (this.order.data_item.content.paymentInfo.status == "1") {
        if (
          this.order.data_item.content.paymentInfo.paymentDate == "" ||
          this.currentPaymentMethod == "" ||
          this.order.data_item.content.paymentInfo.invoice == ""
        ) {
          validResult.valid = false;
          validResult.msg = "Bạn chưa điền đầy đủ thông tin thanh toán";
          return validResult;
        }
      }

      return validResult;
    },
    serviceInfoValidating: function() {
      let validResult = {
        valid: true,
        msg: ""
      };

      if (this.currentChosenServices.length == 0) {
        validResult.valid = false;
        validResult.msg = "Bạn chưa chọn dịch vụ";
        return validResult;
      }

      return validResult;
    },
    infoValidating: function() {
      let validResult = {
        valid: true,
        msg: ""
      };

      // customer info
      validResult = this.customerInfoValidating();
      if (!validResult.valid) {
        return validResult;
      }

      // require info
      validResult = this.requireInfoValidating();
      if (!validResult.valid) {
        return validResult;
      }

      // payment info
      // validResult = this.paymentInfoValidating();
      // if (!validResult.valid) {
      //   return validResult;
      // }

      // service info
      validResult = this.serviceInfoValidating();
      return validResult;
    },

    // Nút chức năng tạo mới đơn hàng
    orderCreateNew: function() {
      // info validating
      let validResult = this.infoValidating();
      if (!validResult.valid) {
        this.$notify({
          group: "notifications",
          title: "KHÔNG ĐƯỢC",
          text: validResult.msg,
          type: "warning",
          width: "400px"
        });
        return;
      }

      // Check Authentication
      this.checkAuthentication();

      // create customer
      this.createCustomer();

      // generate orderid before call api create new order
      this.getGenerateOrderID()
        .then(res => {
          this.order.record_id = res;
          this.order.data_item.id = this.order.record_id;

          // Call api to create new order
          let serverDomain = this.$store.getters.getServerDomain;
          let bucket = "crm_app_order";
          let record = this.order.record_id;
          let api = "/api/core/v1/data/create" + "/" + bucket + "/" + record;
          let url = serverDomain + api;
          this.chargeTotal();
          this.prepareData();
          let data = JSON.parse(JSON.stringify(this.order.data_item));
          if (data.content.hasContract != "0") {
            data.content.quoteTime = this.getCurrentDateTime();
          }
          data.content.status = "0";
          data.content.customerInfo.id = data.content.customerInfo.phone;

          let config = {
            headers: this.$store.getters.getAuthConfig
          };

          axios
            .post(url, data, config)
            .then(response => {
              let orderid = this.order.record_id;
              let path = "/facicare/order-detail" + "/" + orderid;
              this.$router.push({ path: path }).catch(() => {});
              this.$router.go();
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
        })
        .catch(e => {});
    },
    orderConfirmPayment: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api =
        "/api/core/v1/data/update_one/" +
        bucket +
        "/" +
        record +
        "/content/status";
      let url = serverDomain + api;
      let data = '"6"';
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      axios
        .patch(url, data, config)
        .then(response => {
          // reload current page
          this.$router.go();

          // notify to the screen
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Thao tác đã được thực hiện!",
            type: "success",
            width: "400px"
          });
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
    },
    orderConfirmNote: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      let data = JSON.parse(JSON.stringify(this.order.data_item));
      if (data.content.hasContract == "0") {
        if (this.order.data_item.content.paymentInfo.status === "1") {
          data.content.status = "6";
          this.order.data_item.content.status = "6";
        } else {
          data.content.status = "3";
          this.order.data_item.content.status = "3";
        }
      } else {
        data.content.status = "2a";
        this.order.data_item.content.status = "2a";
      }

      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      axios
        .patch(url, data, config)
        .then(response => {
          if (data.content.hasContract == "0") {
            this.isUpdate = true;
            this.assignInfoCode = 1;
            this.isReadonly = true;
            this.isAssignInfoReadonly = false;

            // cập nhật số 2
            // set Assigner Info
            this.setAssignerInfo();

            this.isCustomerInfoReadonly = true;
            this.isConfirmNote = false;
          } else {
            this.isConfirmNote = false;
            this.isSendContract = true;
            this.isReadonly = true;
            this.isCustomerInfoReadonly = true;
          }

          // notify to the screen
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Thao tác đã được thực hiện!",
            type: "success",
            width: "400px"
          });
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
    },
    orderConfirmSendingContract: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      // update order: confirm sending contract
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;

      this.order.data_item.content.quoteTime = this.getCurrentDateTime();
      let data = JSON.parse(JSON.stringify(this.order.data_item));
      data.content.status = "2b";

      // attach link contract to order
      let linkContract = this.$store.getters.linkContract;
      data.content.linkContract = linkContract;

      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      axios
        .patch(url, data, config)
        .then(response => {
          // notify to the screen
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Thao tác đã được thực hiện!",
            type: "success",
            width: "400px"
          });

          // push notification to mobile
          if (this.order.data_item.content.deviceid !== "") {
            this.pushDaGuiHopDongNotificationToMobile();
          } else {
            this.isSendContract = false;
            this.isSignContract = true;
            this.order.data_item.content.status = "2b";
          }

          // turn off upload file dialog
          this.showUploadContractForm = false;
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
    },
    orderConfirmSigningContract: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      // update order: confirm signing contract
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;

      this.order.data_item.content.quoteTime = this.getCurrentDateTime();
      let data = JSON.parse(JSON.stringify(this.order.data_item));
      data.content.status = "2c";

      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      axios
        .patch(url, data, config)
        .then(response => {
          this.order.data_item.content.status = "2c";
          this.isSignContract = false;
          this.isUpdate = true;
          this.isAssignInfoReadonly = false;

          // cập nhật số 2
          // set Assigner Info
          this.setAssignerInfo();

          this.assignInfoCode = 1;

          // notify to the screen
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Thao tác đã được thực hiện!",
            type: "success",
            width: "400px"
          });
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
    },
    orderUpdate: function() {
      // validate data before update
      if (!this.isValidAssign()) {
        this.$notify({
          group: "notifications",
          title: "KHÔNG ĐƯỢC",
          text: "Bạn phải điền đầy đủ thông tin kỹ thuật viên!",
          type: "warning",
          width: "400px"
        });
        return;
      }

      // Check Authentication
      this.checkAuthentication();

      // Handle
      // update order
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      this.getAssigneeList();
      this.prepareData();

      this.order.data_item.content.assignInfo.assignDate = this.getCurrentDateTime();
      let data = JSON.parse(JSON.stringify(this.order.data_item));
      if (this.order.data_item.content.paymentInfo.status === "0") {
        this.order.data_item.content.status = "3";
        data.content.status = "3";
      } else {
        this.order.data_item.content.status = "6";
        data.content.status = "6";
      }
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      axios
        .patch(url, data, config)
        .then(response => {
          // notify to the screen
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Thao tác đã được thực hiện!",
            type: "success",
            width: "400px"
          });

          // push notification to mobile
          if (this.order.data_item.content.deviceid !== "") {
            this.pushPhanCongNotificationToMobile2();
          } else {
            this.isReadonly = true;
            this.isAssignInfoReadonly = true;
            this.isCustomerInfoReadonly = true;
            this.isUpdate = false;
            this.isShowChuyenGiaoButton = true;
          }

          // update technician
          // this.increaseTechnicianTask();
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
    },
    prepareDataAssignTechnicianSurvey: function() {
      let surveyByTechnicianInfo = this.$store.getters.surveyByTechnicianInfo;
      this.order.data_item.content.surveyByTechnicianInfo = {};
      this.order.data_item.content.surveyByTechnicianInfo = surveyByTechnicianInfo;
    },
    orderAssignTechnicianSurvey: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      this.prepareDataAssignTechnicianSurvey();
      let data = JSON.parse(JSON.stringify(this.order.data_item));
      data.content.status = "0a";

      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      axios
        .patch(url, data, config)
        .then(response => {
          // push notification to mobile
          if (this.order.data_item.content.deviceid !== "") {
            this.pushKhaoSatNotificationToMobile2();
          }

          // turn off technician survey dialog
          this.showTechnicianSurveyForm = false;

          // reload this page
          this.$router.go();
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
    },
    prepareDataTechnicianTransfer: function() {
      let technicianTransferInfo = this.$store.getters.technicianTransferInfo;
      let oldTechnician = technicianTransferInfo.oldTechnicianInfo;
      let newTechnician = technicianTransferInfo.newTechnicianInfo;

      let assignee = this.order.data_item.content.assignInfo.assignee;
      for (let i = 0; i < assignee.length; i++) {
        if (assignee[i].id == oldTechnician) {
          this.order.data_item.content.assignInfo.assignee[i].statusTask = "1";
          if (
            this.order.data_item.content.assignInfo.assignee[i].isTeamLeader ==
            true
          ) {
            newTechnician.isTeamLeader = true;
          }
          break;
        }
      }

      this.order.data_item.content.assignInfo.assigneeIDList.push(
        newTechnician.id
      );
      this.order.data_item.content.assignInfo.assignee.push(newTechnician);
    },
    orderTechnicianTransfer: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      this.prepareDataTechnicianTransfer();
      let data = JSON.parse(JSON.stringify(this.order.data_item));
      if (this.order.data_item.content.paymentInfo.status == "1") {
        data.content.status = "6";
      } else {
        data.content.status = "3";
      }

      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      axios
        .patch(url, data, config)
        .then(response => {
          // turn off technician transfer dialog
          this.showTechnicianTransferForm = false;

          // reload this page
          this.$router.go();
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
    },
    orderConfirmAgain: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      this.chargeTotal();
      this.prepareData();
      let data = JSON.parse(JSON.stringify(this.order.data_item));
      data.content.status = "1";
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      // attach link price-quote file to order
      let linkQuote = this.$store.getters.linkQuote;
      data.content.priceQuoteFileLink = linkQuote;

      axios
        .patch(url, data, config)
        .then(response => {
          this.isShowBaoGiaLaiButton = false;
          this.showPriceQuoteAgainForm = false;

          // notify to the screen
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Thao tác đã được thực hiện!",
            type: "success",
            width: "400px"
          });

          // push notification to mobile
          this.pushBaoGiaLaiNotificationToMobile();
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
    },
    orderConfirm: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      this.chargeTotal();
      this.prepareData();
      let data = JSON.parse(JSON.stringify(this.order.data_item));
      data.content.status = "1";
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      if (this.order.data_item.content.deviceid == "") {
        if (data.content.hasContract == "0") {
          data.content.status = "3";
        } else {
          data.content.status = "2a";
          data.content.quoteTime = this.getCurrentDateTime();
        }
      }

      // attach link price-quote file to order
      let linkQuote = this.$store.getters.linkQuote;
      data.content.priceQuoteFileLink = linkQuote;

      axios
        .patch(url, data, config)
        .then(response => {
          this.showPriceQuoteForm = false;

          // notify to the screen
          this.$notify({
            group: "notifications",
            title: "THÀNH CÔNG",
            text: "Thao tác đã được thực hiện!",
            type: "success",
            width: "400px"
          });

          // push notification to mobile
          if (this.order.data_item.content.deviceid !== "") {
            // this.pushBaoGiaNotificationToMobile2();
            this.pushBaoGiaNotificationToMobile();
          } else {
            this.$router.go();
          }
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
    },
    orderPending: function() {
      // tạm thời tắt tính năng chuyển trạng thái pending
      this.$notify({
        group: "notifications",
        title: "KHÔNG CÓ SẴN",
        text: "Tính năng chưa được thực hiện!",
        type: "warning",
        width: "400px"
      });
      return;

      // Check Authentication
      this.checkAuthentication();

      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      this.order.data_item.content.status = "8";
      let data = this.order.data_item;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

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
    },
    orderCancel: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      // oldStatus: chỉ trạng thái chưa hoàn thành công việc mới trừ task của technician khi đơn hàng bị hủy
      let oldStatus = this.order.data_item.content.status;

      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.order.record_id;
      let api = "/api/core/v1/update_many" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      let data = JSON.parse(JSON.stringify(this.order.data_item));
      data.content.status = "7";
      let config = {
        headers: this.$store.getters.getAuthConfig
      };

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

          // push notification to mobile
          if (this.order.data_item.content.deviceid !== "") {
            this.pushHuyDonNotificationToMobile2();
          } else {
            this.order.data_item.content.status = "7";
            this.isShowBaoGiaButton = false;
            this.isShowSpecialButton = false;
            this.isShowChuyenGiaoButton = false;

            this.isPayment = false;
            this.isUpdate = false;
            this.isConfirmNote = false;

            this.isReadonly = true;
            this.isAssignInfoReadonly = true;
            this.isCustomerInfoReadonly = true;
          }

          // update technician task
          // if (
          //   oldStatus === "3" ||
          //   oldStatus === "6" ||
          //   oldStatus === "Chưa xong việc, chưa thanh toán" ||
          //   oldStatus === "Chưa xong việc, đã thanh toán"
          // ) {
          //   this.decreaseTechnicianTask();
          // }
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
    },
    formatingChargeToNumber: function(val) {
      let valArr = val.split(".");
      let result = "";
      for (let i = 0; i < valArr.length; i++) {
        result += valArr[i];
      }
      return +result;
    },
    formartingNumberToCharge: function(val) {
      let result = "";
      val = val + "";
      while (val.length > 3) {
        result = val.substring(val.length - 3, val.length) + result;
        val = val.substring(0, val.length - 3);
        if (val.length > 0) {
          result = "." + result;
        }
      }
      result = val + result;
      return result;
    },
    chargeTotal: function() {
      let result = 0;
      let items = this.order.data_item.content.orderValue.details;
      for (let i = 0; i < items.length; i++) {
        result = result + this.formatingChargeToNumber(items[i].charge);
      }
      // this.order.data_item.content.orderValue.sum = result + "";
      this.order.data_item.content.orderValue.sum = this.formartingNumberToCharge(
        result
      );
    },
    checkValidServiceCharge: function(event) {
      console.log(event);
    },
    paymentStatusFormat: function(status) {
      switch (status) {
        case "0":
          "";
      }
    },
    addServiceDetail: function(serviceID) {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_service";
      let record = serviceID;
      let api = "/api/core/v1/data/detail" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      axios
        .get(url, config)
        .then(response => {
          let resData = response.data;
          if (resData != null) {
            let serviceDetail = resData.data_item.content;
            serviceDetail.charge = "0";
            this.order.data_item.content.orderValue.details.push(serviceDetail);
          }
        })
        .catch(e => {});
    },
    getDemandServiceInOrder: function(item) {
      if (item.data_item.content.orderValue.details.length == 0) {
        let services = item.data_item.content.chosenServices;
        for (let i = 0; i < services.length; i++) {
          this.addServiceDetail(services[i]);
        }
      }

      // show detail service which is ordered
      let services = item.data_item.content.chosenServices;
      for (let i = 0; i < services.length; i++) {
        this.isActiveNoneDisplay[services[i]] = false;
      }
    },
    setPaymentStatus: function() {
      let status = this.order.data_item.content.paymentInfo.status;
      if (status == "0") {
        this.currentPaymentStatus = "Chưa thanh toán";
      } else if (status == "1") {
        this.currentPaymentStatus = "Đã thanh toán";
      } else {
        this.currentPaymentStatus = "";
      }
    },
    changePaymentStatus: function() {
      if (this.currentPaymentStatus == "Chưa thanh toán") {
        this.order.data_item.content.paymentInfo.status = "0";

        // reset all field in payment info
        this.currentPaymentMethod = "";
        this.order.data_item.content.paymentInfo.paymentDate = "";
        this.order.data_item.content.paymentInfo.invoice = {};
      } else if (this.currentPaymentStatus == "Đã thanh toán") {
        this.order.data_item.content.paymentInfo.status = "1";
      } else {
        this.order.data_item.content.paymentInfo.status = "";
      }
    },
    setPaymentMethod: function() {
      let method = this.order.data_item.content.paymentInfo.paymentMethod;
      if (method == "0") {
        this.currentPaymentMethod = "Tiền mặt";
      } else if (method == "1") {
        this.currentPaymentMethod = "Thẻ";
      } else {
        this.currentPaymentMethod = "";
      }
    },
    changePaymentMethod: function() {
      if (this.currentPaymentMethod == "Tiền mặt") {
        this.order.data_item.content.paymentInfo.paymentMethod = "0";
      } else if (this.currentPaymentMethod == "Thẻ") {
        this.order.data_item.content.paymentInfo.paymentMethod = "1";
      } else {
        this.order.data_item.content.paymentInfo.paymentMethod = "";
      }
    },
    getProvinceList: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let api =
        "/api/core/v1/data/detail/crm_app_donvihanhchinh/tree_query/content/province_list";
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      axios
        .get(url, config)
        .then(response => {
          let resData = response.data;
          if (resData != null) {
            resData.data_item.sort(function(a, b) {
              let x = a.province_name.toLowerCase();
              let y = b.province_name.toLowerCase();
              if (x < y) {
                return -1;
              }
              if (x > y) {
                return 1;
              }
              return 0;
            });
            this.addressInfo.province_list = resData.data_item;
          }
        })
        .catch(e => {});
    },
    getDistrictList: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let api =
        "/api/core/v1/data/detail/crm_app_donvihanhchinh/tree_query/content/'" +
        this.currentProvince +
        "'/district_list";
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      axios
        .get(url, config)
        .then(response => {
          let resData = response.data;
          if (resData != null) {
            resData.data_item.sort(function(a, b) {
              let x = a.district_name.toLowerCase();
              let y = b.district_name.toLowerCase();
              switch (x.substring(0, 5)) {
                case "huyện":
                  if (y.substring(0, 5) != "huyện") {
                    return 1;
                  } else {
                    if (x < y) {
                      return -1;
                    }
                    if (x > y) {
                      return 1;
                    }
                    return 0;
                  }
                default:
                  if (y.substring(0, 5) == "huyện") {
                    return -1;
                  } else {
                    if (x < y) {
                      return -1;
                    }
                    if (x > y) {
                      return 1;
                    }
                    return 0;
                  }
              }
            });
            this.addressInfo.district_list = resData.data_item;
          }
        })
        .catch(e => {});
    },
    getWardList: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let api =
        "/api/core/v1/data/detail/crm_app_donvihanhchinh/tree_query/content/'" +
        this.currentProvince +
        "'/'" +
        this.currentDistrict +
        "'/ward_list";
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      axios
        .get(url, config)
        .then(response => {
          let resData = response.data;
          if (resData != null) {
            resData.data_item.sort(function(a, b) {
              let x = a.ward_name.toLowerCase();
              let y = b.ward_name.toLowerCase();
              if (x < y) {
                return -1;
              }
              if (x > y) {
                return 1;
              }
              return 0;
            });
            this.addressInfo.ward_list = resData.data_item;
          }
        })
        .catch(e => {});
    },
    changeProvince: function() {
      // get district list
      this.getDistrictList();

      // set district and ward to default value
      this.currentDistrict = "''";
      this.currentWard = "''";
    },
    changeDistrict: function() {
      // get ward list
      this.getWardList();

      // set ward to default value
      this.currentWard = "''";
    },
    changeWard: function() {
      // do nothing
    },
    getOrderDetail: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_order";
      let record = this.$route.params.orderid;
      let api = "/api/core/v1/data/detail" + "/" + bucket + "/" + record;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      axios
        .get(url, config)
        .then(response => {
          let resData = response.data;
          if (resData != null) {
            this.order = resData;
            this.getDemandServiceInOrder(this.order);
            this.setPaymentStatus();
            this.setPaymentMethod();
            this.checkIsReadonly();
            this.checkIsAssignInfoReadonly();
            this.checkIsCustomerInfoReadonly();
            this.checkIsPayment();
            this.showToolbarButton();
            this.invoiceFormatToString = JSON.stringify(
              this.order.data_item.content.paymentInfo.invoice
            );
            if (
              this.order.data_item.content.status == "3" ||
              this.order.data_item.content.status == "6"
            ) {
              this.setAssignerInfo();
            }
          } else {
            this.order = {};
          }
        })
        .catch(e => {});
    },
    getTechnicians: function() {
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
          let resData = response.data;
          if (resData != null) {
            this.technicians = resData.data;
            this.$store.dispatch("setTechnicians", this.technicians);
          } else {
            this.technicians = [];
            this.$store.dispatch("setTechnicians", []);
          }
        })
        .catch(e => {});
    },
    getServices: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_service";
      let api = "/api/core/v1/data/all_in_bucket" + "/" + bucket;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      axios
        .get(url, config)
        .then(response => {
          let resData = response.data;
          if (resData != null) {
            this.services = resData.data;

            // Init display: none for service cards
            for (let i = 0; i < this.services.length; i++) {
              this.isActiveNoneDisplay[
                this.services[i].data_item.content.id
              ] = true;
            }
          } else {
            this.services = [];
          }
        })
        .catch(e => {});
    },
    itemClick: function(name) {
      this.$router.push({ name: name }).catch(() => {});
    },
    initServiceElement: function() {
      // Check Authentication
      this.checkAuthentication();

      // Handle
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_service";
      let api = "/api/core/v1/data/all_in_bucket" + "/" + bucket;
      let url = serverDomain + api;
      let config = {
        headers: this.$store.getters.getAuthConfig
      };
      axios
        .get(url, config)
        .then(response => {
          let resData = response.data;
          if (resData != null) {
            let data = resData.data;
            // sorting services
            data.sort(function(a, b) {
              let indexA = a.data_item.content.index;
              let indexB = b.data_item.content.index;
              return indexA - indexB;
            });
            for (let i = 0; i < data.length; i++) {
              let serviceDetail = data[i].data_item.content;
              serviceDetail.charge = "0";
              this.order.data_item.content.orderValue.details.push(
                serviceDetail
              );
            }
          }
        })
        .catch(e => {});
    },
    setAssignerInfo: function() {
      this.order.data_item.content.assignInfo.assigner.id = localStorage.getItem(
        "userID"
      );
      this.order.data_item.content.assignInfo.assigner.name = localStorage.getItem(
        "fullname"
      );
      this.order.data_item.content.assignInfo.assigner.phone = localStorage.getItem(
        "phone"
      );
    },
    prepareCustomerData: function(customerID) {
      let ward = this.getCustomerAddressWard();
      let district = this.getCustomerAddressDistrict();
      let province = this.getCustomerAddressProvince();
      let tempAddress =
        this.customerAddress.houseNumberAndStreetName +
        ", " +
        ward +
        ", " +
        district +
        ", " +
        province;

      let result = {
        bucket: "crm_app_customer",
        content: {
          id: customerID,
          personalInfo: {
            address: tempAddress,
            email: "",
            name: this.order.data_item.content.customerInfo.name,
            phone: this.order.data_item.content.customerInfo.phone
          }
        },
        createdByDevice: "facicare",
        creatingDate: this.getCurrentDateTime(),
        description: "",
        id: customerID
      };
      return result;
    },
    createCustomer: function() {
      // Call api to create new order
      let serverDomain = this.$store.getters.getServerDomain;
      let bucket = "crm_app_customer";
      let record = this.order.data_item.content.customerInfo.phone;
      let api = "/api/core/v1/data/create" + "/" + bucket + "/" + record;
      let url = serverDomain + api;

      let data = this.prepareCustomerData(record);

      let config = {
        headers: this.$store.getters.getAuthConfig
      };

      axios
        .post(url, data, config)
        .then(res => {})
        .catch(e => {});
    }
  },
  created() {
    // Check case create new or not
    let currentURL = window.location.href.split("/");
    let orderid = this.$route.params.orderid;
    if (
      orderid == "create-new" ||
      currentURL[currentURL.length - 1] == "create-new"
    ) {
      this.isCreateNew = true;
    } else {
      this.isCreateNew = false;
    }

    this.getTechnicians();

    if (!this.isCreateNew) {
      this.getOrderDetail();
      this.$store.dispatch("setPageTitle", "Chi tiết đơn hàng");
    } else {
      this.$store.dispatch("setPageTitle", "Tạo đơn hàng");
      this.getServices();
      this.isReadonly = false;

      // init service element
      this.initServiceElement();

      // get province & district list
      this.getProvinceList();
      this.getDistrictList();
    }
  }
};
</script>
<style>
.order-detail-label {
  text-align: right;
  margin-top: 5px;
  padding-top: 6px;
  padding-bottom: 6px;
  color: rgba(0, 0, 0, 0.87) !important;
}
.order-detail-input {
  padding-top: 6px;
  padding-bottom: 6px;
  color: rgba(0, 0, 0, 0.87) !important;
}
.order-detail-input input,
.order-detail-input select {
  padding: 5px !important;
  border: 1px solid #95a5a6 !important;
  border-radius: 4px !important;
  width: 100% !important;
  font-size: 0.875rem !important;
}
.order-detail-span {
  margin-top: 0px;
  padding-bottom: 1px;
  font-size: 0.875rem !important;
  color: rgba(0, 0, 0, 0.87) !important;
}
.fieldset-info-box {
  border-color: white;
  color: rgba(0, 0, 0, 0.87) !important;
}
.legend-info-box {
  color: #34495e;
  font-size: 20px;
  font-weight: bold;
  margin-left: 6px;
  margin-bottom: 6px;
}
.input-group {
  padding: 0px 15px;
}
.service-card {
  margin-top: 5px;
}
div.v-input__slot {
  min-height: 35px !important;
  font-size: 0.875rem !important;
  color: rgba(0, 0, 0, 0.87) !important;
  margin-bottom: 0px !important;
}
.v-progress-circular {
  margin: 1rem;
}
div.v-text-field__details {
  display: none !important;
}
div.order-customer-datetime {
  padding-top: 4px;
  padding-bottom: 6px;
}
div.order-customer-datetime div {
  margin-top: 0px !important;
  padding-top: 0px !important;
}
div.order-customer-datetime div div div {
  padding: 0px 6px !important;
}
div.order-customer-datetime div div div div {
  padding: 0px !important;
}
div.order-customer-datetime div div div fieldset {
  padding-left: 0px !important;
}
.noneDisplay {
  display: none;
}
.price-quote-request {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  margin-bottom: 12px;
}
.price-quote-request span {
  font-style: italic;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.87);
}
</style>

<style scoped>
input:focus {
  outline: none !important;
  box-shadow: 0px 0px 2px #3498db !important;
  border: 1px solid #3498db !important;
  border-radius: 4px !important;
}
select:focus {
  outline: none !important;
  box-shadow: 0px 0px 2px #3498db !important;
  border: 1px solid #3498db !important;
  border-radius: 4px !important;
}
</style>
