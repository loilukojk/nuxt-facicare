import config from '../../config'
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
      let api = "/api/core/v1/minio/create";
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

  // Upload media file
  UploadMediaFile: function (bucketID, payload) {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/minio/upload";
      let url = host + api + "/" + bucketID;

      let data = new FormData();
      for (let i = 0; i < payload.length; i++) {
        data.append("data", payload[i]);
      }

      let config = {
        headers: {
          'Authorization': "Bearer " + token,
          'Content-Type': "multipart/form-data"
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

  // Delete media record
  DeleteMediaRecord: function (bucketID, payload) {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/minio/delete_object";
      let url = host + api + "/" + bucketID + "/" + payload;
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

  // Delete bucket
  DeleteBucket: function (bucketID) {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/minio/delete_bucket";
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

  // Get all object
  GetAllObject: function () {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/minio/object/all";
      let url = host + api;
      let config = {
        headers: {
          'Authorization': "Bearer " + token,
          'userid': userID
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

  // Get all bucket
  GetAllBucket: function () {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/minio/bucket/all";
      let url = host + api;
      let config = {
        headers: {
          'Authorization': "Bearer " + token,
          'userid': userID
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

  // Get list & quantity of bucket in device
  GetListAndQuantityOfBucket: function () {
    return new Promise((resolve, reject) => {
      let api = "/api/core/v1/minio/bucket/list";
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
  }
}
