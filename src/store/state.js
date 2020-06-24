export default {
  serverDomain: "https://sme-dev.vdc2.com.vn",
  // serverDomain: "http://221.132.29.81:1325",
  // serverDomain: "http://203.162.141.98:1323",
  // serverDomain: "http://localhost:1323",
  authenBucket: "facicare",
  auth: {
    userid: "user1",
    deviceid: "facicare_app",
    Authorization: ""
    // Authorization:
      // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJRCI6ImNybV9hcHAiLCJleHAiOjE2MjM1NDU0NzIsInVzZXJJRCI6InVzZXIxIn0.LCHlhdlUvx59hxt1kGTby5fPJn5KkiwifpobXgbHedo",
  },
  token: localStorage.getItem("access_token") || null,
  technician: {
    bucket_id: "",
    data_item: {
      bucket: "",
      content: {
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        address: "",
        type: "",
        roles: "technician",
        password: "",
        username: "",
      },
      id: "",
      createdByDevice: "",
      creatingDate: "",
      description: "",
    },
    device_id: "",
    record_id: "",
  },
  customer: {
    bucket_id: "",
    data_item: {
      bucket: "",
      content: {
        id: "",
        personalInfo: {
          name: "",
          phone: "",
          email: "",
          address: ""
        }
      },
      id: "",
      createdByDevice: "",
      creatingDate: "",
      description: "",
    },
    device_id: "",
    record_id: "",
  },
  order: {
    priceQuoteFileLink: "",
    linkContract: "",
    id: "",
    customerInfo: {
      id: "",
      name: "",
      phone: "",
      address: "",
    },
    chosenServices: [],
    expectedTime: "",
    expectedAddress: "",
    note: "",
    status: "",
    paymentInfo: {
      status: "",
      paymentMethod: "",
      paymentDate: "",
      invoice: {},
    },
    orderValue: {
      sum: "",
      details: [],
    },
    imageList: [],
    videoList: "",
    assignInfo: {
      assignDate: "",
      assigner: {
        id: "",
        name: "",
        phone: "",
      },
      assignee: {
        id: "",
        name: "",
        phone: "",
        avatar: "",
        workDate: "",
      },
    },
    priceQuoteRequests: [],
    priceQuoteTimes: "",
  },
  sync: {
    orderList: [],
  },
  customerList: [],
  isCreateNew: false,
  pageTitle: "",
  notificationHistory: [],
  linkContract: "",
  priceQuoteFileLink: "",
  technicians: [],
  surveyByTechnicianInfo: {},
  oldTechnicians: [],
  remainingTechnicians: [],
  technicianTransferInfo: {},
  orderTimeline: []
};
