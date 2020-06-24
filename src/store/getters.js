export default {
  loggedIn(state) {
    if (state.token !== null) {
      let numExpirationTime = Number(localStorage.getItem("exp"))
      let numCurrentDateTime = Number(Math.floor(Date.now() / 1000))
      if (numCurrentDateTime <= numExpirationTime) {
        return true;
      }
    }
    return false;
  },
  getAuthenBucket: function (state) {
    return state.authenBucket;
  },
  getTechnician: function (state) {
    return state.technician
  },
  getCustomer: function (state) {
    return state.customer
  },
  getOrder: function (state) {
    return state.order
  },
  pageTitle(state) {
    return state.pageTitle;
  },
  getServerDomain(state) {
    return state.serverDomain;
  },
  getAuthConfig: function (state) {
    return state.auth
  },
  getIsCreateNew: function (state) {
    return state.isCreateNew;
  },
  orderList: function (state) {
    return state.sync.orderList;
  },
  customerList: function(state) {
    return state.customerList;
  },
  linkContract: function (state) {
    return state.linkContract;
  },
  linkQuote: function (state) {
    return state.priceQuoteFileLink;
  },
  technicians: function(state) {
    return state.technicians;
  },
  surveyByTechnicianInfo: function(state) {
    return state.surveyByTechnicianInfo;
  },
  oldTechnicians: function(state) {
    return state.oldTechnicians;
  },
  remainingTechnicians: function(state) {
    return state.remainingTechnicians;
  },
  technicianTransferInfo: function(state) {
    return state.technicianTransferInfo;
  },
  orderTimeline: function(state) {
    return state.orderTimeline;
  }
}
