import config from '../config'
import axios from 'axios'

// Get constants from config file
const host = config.host;
const userID = config.userID;
const token = config.device.apiKey;

// Functions
export default {
  // Create a Bucket
  CreateBucket: function (bucketID, payload) {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/bucket/create";
      let url = host + api + "/" + bucketID;
      let data = payload;
      let config = {
        headers: {
          'Authorization': "Bearer " + token
        }
      }
      axios
        .post(url, data, config)
        .then(response => {
          resolve(response);
        })
        .catch(e => { reject(e) });
    })
  },

  // Get all Bucket
  GetAllBucKet: function () {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/bucket/all";
      let url = host + api;
      let config = {
        headers: {
          userid: userID
        }
      }
      axios
        .get(url, config)
        .then(response => {
          resolve(response);
        })
        .catch(e => { reject(e) });
    })
  },

  // Get all Bucket in Device
  GetAllBucKetInDevice: function () {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/bucket/all_in_device";
      let url = host + api;
      let config = {
        headers: {
          'Authorization': "Bearer " + token
        }
      }
      axios
        .get(url, config)
        .then(response => {
          resolve(response);
        })
        .catch(e => { reject(e) });
    })
  },

  // Get detail of a bucket by bucket ID
  GetDetailBucketByBucketID: function (bucketID) {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/bucket/detail";
      let url = host + api + "/" + bucketID;
      let config = {
        headers: {
          'Authorization': "Bearer " + token
        }
      }
      axios
        .get(url, config)
        .then(response => {
          resolve(response);
        })
        .catch(e => { reject(e) });
    })
  },

  // Update a Bucket by bucket ID
  UpdateBucketByBucketID: function (bucketID, payload) {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/bucket/update";
      let url = host + api + "/" + bucketID;
      let data = payload;
      let config = {
        headers: {
          'Authorization': "Bearer " + token
        }
      }
      axios
        .patch(url, data, config)
        .then(response => {
          resolve(response);
        })
        .catch(e => { reject(e) });
    })
  },

  // Delete a Bucket by bucket ID
  DeleteBucketByBucketID: function (bucketID) {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/bucket/delete";
      let url = host + api + "/" + bucketID;
      let config = {
        headers: {
          'Authorization': "Bearer " + token
        }
      }
      axios
        .delete(url, config)
        .then(response => {
          resolve(response);
        })
        .catch(e => { reject(e) });
    })
  },

  // Get list & quantity of bucket in device
  GetListAndQuantityOfBucket: function () {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/bucket/list";
      let url = host + api;
      let config = {
        headers: {
          'Authorization': "Bearer " + token
        }
      }
      axios
        .get(url, config)
        .then(response => {
          resolve(response);
        })
        .catch(e => { reject(e) });
    })
  },

  // Get list record from bucket
  GetListRecordByBucketID: function (bucketID) {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/bucket/list_record";
      let url = host + api + "/" + bucketID;
      let config = {
        headers: {
          'Authorization': "Bearer " + token
        }
      }
      axios
        .get(url, config)
        .then(response => {
          resolve(response);
        })
        .catch(e => { reject(e) });
    })
  }
}
