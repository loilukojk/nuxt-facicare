import config from './config'
import Centrifuge from 'centrifuge'

// Get constants from config file
const defaultChannel = config.device.apiKey;
const centrifugoServer = config.centrifugoServer;
const centrifugeJWT = config.centrifugeJWT;

// Centrifuge-js connection setup
// var centrifuge = new Centrifuge('ws://' + centrifugoServer + '/connection/websocket');
var centrifuge = new Centrifuge(centrifugoServer + '/connection/websocket');
centrifuge.setToken(centrifugeJWT);
centrifuge.on('connect', function (ctx) {
    console.log('Connected with client ID ' + ctx.client);
});
centrifuge.on('disconnect', function (ctx) {
    console.log('Disconnected: ' + ctx.reason);
});

// Export Functions
export default {
    // Connect to centrifugo server
    Connect: function () {
        centrifuge.connect();
    },

    // Disconnect with centrifugo server
    Disconnect: function () {
        centrifuge.disconnect();
    },

    // Subscribe default channel
    Subscribe: function (handlerFunc) {
        centrifuge.subscribe(defaultChannel, handlerFunc)
    },

    // Publish a message to default channel
    Publish: function (msg) {
        return new Promise((resolve, reject) => {
            var sendMsg = {'message': msg };
            centrifuge.publish(defaultChannel, sendMsg).then(function (res) {
                resolve('successfully published');
            }, function (err) {
                reject('publish error');
            });
        })
    },

    // Subscribe a specific channel
    SubscribeChannel: function (channel, handlerFunc) {
        centrifuge.subscribe(channel, handlerFunc)
    },

    // Publish a message to a specific channel
    PublishToChannel: function (channel, msg) {
        return new Promise((resolve, reject) => {
            var sendMsg = {'message': msg };
            centrifuge.publish(channel, sendMsg).then(function (res) {
                resolve('successfully published');
            }, function (err) {
                reject('publish error');
            });
        })
    }
}
