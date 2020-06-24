// import Vue from 'vue'
import pushNotificationSDK from "../pushNotificationSDK/index";
import axios from "axios";
import jwt from "jsonwebtoken";
import Vue from "vue";

export default {
  getAPIKey(context) {
    return new Promise((resolve, reject) => {
      let serverDomain = context.state.serverDomain;
      let bucket = "facicare";
      let url = serverDomain + "/api/core/v1/device/detail/" + bucket;
      let config = {
        headers: {
          userid: "user1",
        },
      };
      axios
        .get(url, config)
        .then((res) => {
          let respData = res.data;
          let apiKey = respData.data_item.apiKey;
          context.state.auth.Authorization = "Bearer " + apiKey;
          resolve("done");
        })
        .catch((err) => {
          resolve("done");
        });
    })
  },
  startReLogin(context) {
    context.state.token = null;
    localStorage.clear();
    this.$router.push({ name: "Login" });
  },
  destroyToken(context) {
    // axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token
    if (context.getters.loggedIn) {
      return new Promise((resolve, reject) => {
        localStorage.removeItem("access_token");
        context.commit("destroyToken");
        let response = "oke";
        resolve(response);
      });
    }
  },
  retrieveToken(context, credentials) {
    return new Promise((resolve, reject) => {
      // authen by calling api
      let serverDomain = context.state.serverDomain;
      let authenBucket = context.state.authenBucket;
      let loginAPI = serverDomain + "/api/core/v1/user/login/" + authenBucket;
      let config = {
        headers: context.getters.getAuthConfig,
      };
      axios
        .post(
          loginAPI,
          {
            username: credentials.username,
            password: credentials.password,
          },
          config
        )
        .then((response) => {
          if (response.data.token != undefined) {
            const token = response.data.token;
            let secretKey = "secret";
            jwt.verify(token, secretKey, function(err, decoded) {
              if (err != null) {
                console.log(err);
                reject(err);
              }
              if (decoded.roles == "crm_admin") {
                let data = {
                  token: context.state.auth.Authorization,
                  username: decoded.information.username,
                  roles: decoded.roles,
                  exp: decoded.exp,
                  userID: decoded.information.user_id,
                  fullname:
                    decoded.information.last_name +
                    " " +
                    decoded.information.first_name,
                  phone: decoded.information.phone_number,
                };
                localStorage.setItem("access_token", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("userID", data.userID);
                localStorage.setItem("fullname", data.fullname);
                localStorage.setItem("phone", data.phone);
                localStorage.setItem("exp", data.exp);
                localStorage.setItem("roles", data.roles);
                context.commit("retrieveToken", data.token);
                resolve(data);
              } else {
                reject("roles is not enough");
              }
            });
          } else {
            reject(response.data.message);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  clearUserInfo(context) {
    context.commit("clearUserInfo");
  },
  setTechnician: function({ commit }, technician) {
    commit("setTechnician", technician);
  },
  setCustomer: function({ commit }, customer) {
    commit("setCustomer", customer);
  },
  setOrder: function({ commit }, order) {
    commit("setOrder", order);
  },
  setPageTitle(context, pageTitle) {
    context.commit("setPageTitle", pageTitle);
  },
  setIsCreateNew(context, isCreateNew) {
    context.commit("setIsCreateNew", isCreateNew);
  },
  getOrderList(context) {
    return new Promise((res, rej) => {
      let serverDomain = context.getters.getServerDomain;
      let bucket = "crm_app_order";
      let api = "/api/core/v1/data/all_in_bucket" + "/" + bucket;
      let url = serverDomain + api;
      let config = {
        headers: context.getters.getAuthConfig,
      };
      axios
        .get(url, config)
        .then(async (response) => {
          let resData = response.data;
          let orderList = [];

          if (resData.data != null) {
            let tempData = resData.data;
            // orderList = await tempData.sort(function(a, b) {
            //   let temp = getComparing(
            //     a.data_item.creatingDate,
            //     b.data_item.creatingDate
            //   );
            //   return temp;
            // });
            orderList = tempData;
          }

          context.commit("setOrderList", orderList);
          res("success");
        })
        .catch((e) => {
          let orderList = [];
          context.commit("setOrderList", orderList);
          res("success");
        });
    });
  },
  getCustomerList(context) {
    let serverDomain = context.getters.getServerDomain;
    let bucket = "crm_app_customer";
    let api = "/api/core/v1/data/all_in_bucket" + "/" + bucket;
    let url = serverDomain + api;
    let config = {
      headers: context.getters.getAuthConfig,
    };
    axios
      .get(url, config)
      .then(async (response) => {
        let resData = response.data;
        let customerList = [];

        if (resData.data != null) {
          let tempData = resData.data;
          customerList = tempData;
        }
        context.commit("setCustomerList", customerList);
      })
      .catch((e) => {
        let customerList = [];
        context.commit("setCustomerList", customerList);
      });
  },
  pushNotification(context, message) {
    return new Promise((resolve, reject) => {
      let mobileChannel = message.content.mobileChannel;
      if (mobileChannel != "") {
        console.log(mobileChannel);
        pushNotificationSDK.notification
          .PublishToChannel(mobileChannel, message)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  },
  getNotificationHistory(context) {
    return new Promise((resolve, reject) => {
      let serverDomain = context.getters.getServerDomain;
      let bucket = "crm_app_push_notification";
      let api = "/api/core/v1/data/all_in_bucket" + "/" + bucket;
      let url = serverDomain + api;
      let config = {
        headers: context.getters.getAuthConfig,
      };
      axios
        .get(url, config)
        .then((response) => {
          if (response.data != null) {
            if (response.data.data != null) {
              // let tempArr = creatingDateFormating(response.data.data);
              let tempArr = response.data.data;
              let notiHistory = historySorting(tempArr);
              context.commit("setNotificationHistory", notiHistory);
              resolve(notiHistory);
            } else {
              context.commit("setNotificationHistory", []);
              resolve([]);
            }
          } else {
            context.commit("setNotificationHistory", []);
            resolve([]);
          }
        })
        .catch((e) => {
          context.commit("setNotificationHistory", []);
          reject(e);
        });
    });
  },
  connectToPushNotificationServer(context) {
    // connect to centrifuge server
    pushNotificationSDK.notification.Connect();

    // subscribe crm channel to receive all message from mobile app
    const crmChannel = "facicare_web_channel";
    pushNotificationSDK.notification.SubscribeChannel(
      crmChannel,
      async (payload) => {
        context.dispatch("getNotificationHistory");

        // Get order list if route is /orders
        context.dispatch("getOrderList");

        let message = payload.data.message;
        let sound = await "http://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3";
        if (sound) {
          var audio = await new Audio(sound);
          audio.play();
        }
        Vue.notify({
          group: "notifications",
          title: "HỆ THỐNG",
          text: message.content.msg,
          duration: 10000,
          type: "warn",
          width: "400px",
        });
      }
    );
  },
  setLinkContract(context, path) {
    context.commit("setLinkContract", path);
  },
  setLinkQuote(context, path) {
    context.commit("setLinkQuote", path);
  },
  setTechnicians(context, technicians) {
    context.commit("setTechnicians", technicians);
  },
  setSurveyByTechnicianInfo(context, item) {
    context.commit("setSurveyByTechnicianInfo", item);
  },
  setOldAndRemainingTechnicians(context, order) {
    context.commit("setOldAndRemainingTechnicians", order);
  },
  setTechnicianTransferInfo(context, item) {
    context.commit("setTechnicianTransferInfo", item);
  },
  setOrderTimelineByID(context, orderID) {
    let serverDomain = context.getters.getServerDomain;
    let bucket = "crm_app_order";
    let api = "/api/core/v1/event/data/" + bucket + "/" + orderID;
    let url = serverDomain + api;
    let config = {
      headers: context.getters.getAuthConfig,
    };
    axios
      .get(url, config)
      .then((response) => {
        let resData = response.data;
        let timeline = [];

        if (resData.data != null) {
          let tempData = resData.data;
          timeline = tempData;
        }
        context.commit("setOrderTimeline", timeline);
      })
      .catch((e) => {
        let timeline = [];
        context.commit("setOrderTimeline", timeline);
      });
  },
};

function creatingDateFormating(arr) {
  for (let i = 0; i < arr.length; i++) {
    let tempDatetime = arr[i].data_item.creatingDate.split(" ");
    let tempDate = tempDatetime[0].split("/");
    let time = tempDatetime[1];
    let date = tempDate[2] + "/" + tempDate[1] + "/" + tempDate[0];
    let datetime = date + " " + time;

    arr[i].data_item.creatingDate = datetime;
  }
  return arr;
}

function historySorting(arr) {
  arr.sort(function(a, b) {
    let x = a.data_item.creatingDate.toLowerCase();
    let y = b.data_item.creatingDate.toLowerCase();
    if (x < y) {
      return 1;
    }
    if (x > y) {
      return -1;
    }
    return 0;
  });
  return arr;
}

function getComparing(dateA, dateB) {
  let a = dateFormat(dateA);
  let b = dateFormat(dateB);
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

function dateFormat(dateStr) {
  let arr = dateStr.split(" ");
  let tempDate = arr[0].split("/");
  let result =
    tempDate[2] + "/" + tempDate[1] + "/" + tempDate[0] + " " + arr[1];
  return result;
}
