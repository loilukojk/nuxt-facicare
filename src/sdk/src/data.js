import config from '../config'
import axios from 'axios'

// Get constants from config file
const host = config.host;
const userID = config.userID;
const token = config.device.apiKey;

// Functions
export default {
    // Create a record
    CreateRecord: function (recordID, bucketID, payload) {
        return new Promise((resolve, reject) => {
            let api = "/api/core/v1/data/create";
            let url = host + api + "/" + bucketID + "/" + recordID;
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

    // Get all record
    GetAllRecord: function () {
        return new Promise((resolve, reject) => {
            let api = "/api/core/v1/data/all";
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

    // Get all record in bucket
    GetAllRecordInBucket: function (bucketID) {
        return new Promise((resolve, reject) => {
            let api = "/api/core/v1/data/all_in_bucket";
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

    // Get detail of a record by record ID
    GetDetailRecordByRecordID: function (recordID, bucketID) {
        return new Promise((resolve, reject) => {
            let api = "/api/core/v1/data/detail";
            let url = host + api + "/" + bucketID + "/" + recordID;
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

    // Update a record by record ID
    UpdateRecordByRecordID: function (recordID, bucketID, payload) {
        return new Promise((resolve, reject) => {
            let api = "/api/core/v1/update_many";
            let url = host + api + "/" + bucketID + "/" + recordID;
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

    // Update a field in record by record ID
    UpdateOneFieldByRecordID: function (recordID, bucketID, payload) {
        return new Promise((resolve, reject) => {
            let api = "/api/core/v1/data/update_one"
            let url = host + api + "/" + bucketID + "/" + recordID + "/" + payload.fieldPath;
            let data = payload.data;
            let config = {
                headers: {
                    'Authorization': "Bearer " + token
                }
            };
            if (payload.type === "text") {
                config = {
                    headers: {
                        'Authorization': "Bearer " + token,
                        'Content-Type': "text/plain"
                    }
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

    // Update some field record by record ID
    UpdateSomeFieldByRecordID: function (recordID, bucketID, payload) {
        return new Promise((resolve, reject) => {
            let api = "/api/core/v1/data/update_field";
            let url = host + api + "/" + bucketID + "/" + recordID;
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

    // Delete a record by record ID
    DeleteRecordByRecordID: function (recordID, bucketID) {
        return new Promise((resolve, reject) => {
            let api = "/api/core/v1/data/delete";
            let url = host + api + "/" + bucketID + "/" + recordID;
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

    // Get list & quantity of record in bucket
    GetListAndQuantityOfRecordByBucketID: function (bucketID) {
        return new Promise((resolve, reject) => {
            let api = "/api/core/v1/data/list";
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

    // Get some specific record
    GetSomeSpecificRecord: function (bucketID, payload) {
        return new Promise((resolve, reject) => {
            let api = "/api/core/v1/data/retrieve_many";
            let url = host + api + "/" + bucketID;
            let data = payload
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

    // Query data by many condition
    QueryDataByManyCondition: function (bucketID, payload) {
        return new Promise((resolve, reject) => {
            let api = "/api/core/v1/data/all_in_bucket/match";
            let url = host + api + "/" + bucketID;
            let data = payload
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

    // Search Data
    SearchData: function (bucketID, payload) {
        return new Promise((resolve, reject) => {
            let paramQuery = "?field=" + payload.field + "&pattern=" + payload.pattern
            let api = "/api/core/v1/data/all_in_bucket/search";
            let url = host + api + "/" + bucketID + paramQuery;
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
