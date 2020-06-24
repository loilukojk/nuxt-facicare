export default {
  retrieveToken(state, token) {
    state.token = token;
  },
  destroyToken(state) {
    state.token = null;
  },
  clearUserInfo() {
    localStorage.clear();
  },
  setTechnician: function(state, technician) {
    state.technician = technician;
  },
  setCustomer: function(state, customer) {
    state.customer = customer;
  },
  setOrder: function(state, order) {
    state.order = order;
  },
  setPageTitle(state, pageTitle) {
    state.pageTitle = pageTitle;
  },
  setIsCreateNew(state, isCreateNew) {
    state.isCreateNew = isCreateNew;
  },
  setOrderList(state, orderList) {
    state.sync.orderList = orderList;
  },
  setCustomerList(state, items) {
    state.customerList = items;
  },
  setNotificationHistory(state, notificationHistory) {
    state.notificationHistory = notificationHistory;
  },
  setLinkContract(state, path) {
    state.linkContract = path;
  },
  setLinkQuote(state, path) {
    state.priceQuoteFileLink = path;
  },
  setTechnicians(state, technicians) {
    state.technicians = technicians;
  },
  setSurveyByTechnicianInfo(state, item) {
    state.surveyByTechnicianInfo = item;
  },
  setOldAndRemainingTechnicians(state, order) {
    let oldTechnicians = [];
    let oldTechnicians2 = [];
    let remainingTechnicians = [];

    // get old technicians in order
    let assignee = order.data_item.content.assignInfo.assignee;
    oldTechnicians = assignee;
    // for (let i = 0; i < assignee.length; i++) {
    //   if (assignee[i].statusTask != "1") {
    //     oldTechnicians.push(assignee[i]);
    //   }
    // }

    // get remaining technicians
    remainingTechnicians = state.technicians;
    for (let i = 0; i < oldTechnicians.length; i++) {
      remainingTechnicians = remainingTechnicians.filter(function(item) {
        if (
          item.record_id == oldTechnicians[i].id &&
          oldTechnicians[i].statusTask != "1"
        ) {
          oldTechnicians2.push(item);
        }
        return item.record_id != oldTechnicians[i].id;
      });
    }

    // set final value
    state.oldTechnicians = oldTechnicians2;
    state.remainingTechnicians = remainingTechnicians;
  },
  setTechnicianTransferInfo(state, item) {
    state.technicianTransferInfo = item;
  },
  setOrderTimeline(state, timeline) {
    let result = [];
    let i = 0;
    do {
      if (i + 1 < timeline.length) {
        let status2 = timeline[i + 1].payload.content.status;
        let status1 = timeline[i].payload.content.status;
        if (status1 != 3 && status1 != 6) {
          if (status1 != status2) {
            let temp = {
              title: getDateTime(timeline[i].timestamp),
              content: getContentTimeline(timeline[i]),
            };
            result.push(temp);
            i++;
          } else {
            i++;
          }
        } else {
          let temp = {
            title: getDateTime(timeline[i].timestamp),
            content: getContentTimeline(timeline[i], timeline[i - 1]),
          };

          result.push(temp);
          i++;
        }
      } else {
        let temp = {
          title: getDateTime(timeline[i].timestamp),
          content: getContentTimeline(timeline[i]),
        };
        result.push(temp);
        i++;
      }
    } while (i < timeline.length);
    state.orderTimeline = result;
  }
};

function getDateTime(timestamp) {
  // Months array
  var months_arr = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  // Convert timestamp to milliseconds
  var date = new Date(timestamp * 1000);

  // Year
  var year = date.getFullYear();

  // Month
  var month = months_arr[date.getMonth()];

  // Day
  var day = date.getDate();

  // Hours
  var hours = date.getHours();

  // Minutes
  var minutes = "0" + date.getMinutes();

  // Seconds
  var seconds = "0" + date.getSeconds();

  // Display date time in dd-MM-yyyy h:m:s format
  var result =
    day +
    "-" +
    month +
    "-" +
    year +
    " " +
    hours +
    ":" +
    minutes.substr(-2) +
    ":" +
    seconds.substr(-2);

  return result;
}

function getContentTimeline(item, item2) {
  let method = item.method;
  let content = item.payload.content;
  let status = item.payload.content.status;

  if (method == "Create") {
    return "Đơn hàng được tạo mới bởi khách hàng " + content.customerInfo.name;
  } else {
    switch (status) {
      case "0":
        return "Đơn hàng được tạo mới";
      case "0a":
        return "Đã phân công KTV thực hiện khảo sát";
      case "0b":
        return "KTV đã thực hiện xong khảo sát";
      case "1":
        return "Đã gửi báo giá đến khách hàng";
      case "1a":
        return (
          "Khách hàng yêu cầu báo giá lại lần " +
          item.payload.content.priceQuoteTimes
        );
      case "2":
        return "Khách hàng phản hồi, yêu cầu điều chỉnh thông tin";
      case "2a":
        return "Đơn hàng được chấp nhận, chưa gửi hợp đồng cho khách hàng";
      case "2b":
        return "Đã gửi hợp đồng cho khách hàng";
      case "3":
        let l1 = item.payload.content.assignInfo.assigneeIDList.length;
        let l2 = item2.payload.content.assignInfo.assigneeIDList.length;
        if (l1 > 0) {
          if (l2 == 0) {
            return "Đã phân công KTV thực hiện đơn hàng. Đơn hàng chưa được thanh toán";
          } else if (l1 > l2) {
            return getContentChuyenGiao(
              item.payload.content.assignInfo,
              item2.payload.content.assignInfo
            );
          } else {
            return getContentDoneTask(
              item.payload.content.assignInfo,
              item2.payload.content.assignInfo
            );
          }
        } else {
          return "Đã chốt đơn hàng, chưa phân công KTV. Đơn hàng chưa được thanh toán";
        }
      case "6":
        if (item.payload.content.assignInfo.assigneeIDList.length > 0) {
          return "Đã phân công KTV thực hiện đơn hàng. Đơn hàng đã được thanh toán";
        } else {
          return "Đã chốt đơn hàng, chưa phân công KTV. Đơn hàng đã được thanh toán";
        }
      case "4":
        return "Toàn bộ công việc của đơn hàng đã được hoàn tất. Đơn hàng chưa được thanh toán";
      case "5":
        return "Hoàn tất công việc, đã thanh toán";
      case "7":
        return "Đơn hàng bị hủy";
      case "8":
        return "Đơn hàng pending";
      case "2c":
        return "Đã chốt đơn hàng, chưa phân công";

      default:
        return "Trạng thái " + content.status;
    }
  }
}

function getContentChuyenGiao(assignInfo1, assignInfo2) {
  let result = "";

  // Tìm ID KTV mới
  let assigneeIDList1 = assignInfo1.assigneeIDList;
  let assigneeIDList2 = assignInfo2.assigneeIDList;
  let newTechnicianID = "";
  for (let i = 0; i < assigneeIDList1.length; i++) {
    let isNewTechnician = true;
    for (let j = 0; j < assigneeIDList2.length; j++) {
      if (assigneeIDList1[i] == assigneeIDList2[j]) {
        isNewTechnician = false;
        break;
      }
    }
    if (isNewTechnician) {
      newTechnicianID = assigneeIDList1[i];
      break;
    }
  }

  // Tìm tên KTV cũ
  let oldTechnicianName = "";
  let assigneeList1 = assignInfo1.assignee;
  let assigneeList2 = assignInfo2.assignee;
  for (let i = 0; i < assigneeList2.length; i++) {
    if (assigneeList2[i].statusTask != "1") {
      for (let j = 0; j < assigneeList1.length; j++) {
        if (
          assigneeList2[i].id == assigneeList1[j].id &&
          assigneeList1[j].statusTask == "1"
        ) {
          oldTechnicianName = assigneeList1[j].name;
          break;
        }
      }
    }
    if (oldTechnicianName != "") {
      break;
    }
  }

  // Tìm tên KTV mới
  let newTechnicianName = "";
  for (let i = 0; i < assigneeList1.length; i++) {
    if (assigneeList1[i].id == newTechnicianID) {
      newTechnicianName = assigneeList1[i].name;
      break;
    }
  }

  result =
    "Chuyển giao công việc từ " +
    oldTechnicianName +
    " cho " +
    newTechnicianName;

  return result;
}

function getContentDoneTask(assignInfo1, assignInfo2) {
  // Tìm tên KTV done task
  let technicianName = "";
  let assigneeList1 = assignInfo1.assignee;
  let assigneeList2 = assignInfo2.assignee;
  for (let i = 0; i < assigneeList2.length; i++) {
    if (assigneeList2[i].statusTask != "1") {
      for (let j = 0; j < assigneeList1.length; j++) {
        if (
          assigneeList2[i].id == assigneeList1[j].id &&
          assigneeList1[j].statusTask == "1"
        ) {
          technicianName = assigneeList1[j].name;
          break;
        }
      }
    }
    if (technicianName != "") {
      break;
    }
  }

  let msg = "KTV " + technicianName + " đã hoàn tất tác vụ";

  return msg;
}