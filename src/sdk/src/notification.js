import config from '../config'
import Centrifuge from 'centrifuge'
import Vue from 'vue'

// Get constants from config file
const defaultChannel = config.device.apiKey;
const centrifugoServer = config.centrifugoServer;
const centrifugeJWT = config.centrifugeJWT;

// Centrifuge-js connection setup
// var centrifuge = new Centrifuge('ws://' + centrifugoServer + '/connection/websocket');
var centrifuge = new Centrifuge(centrifugoServer + '/connection/websocket');
centrifuge.setToken(centrifugeJWT);
centrifuge.on('connect', function (ctx) {
    console.log('Connected with client ID ' + ctx.client + ' over ' + ctx.transport);
});
centrifuge.on('disconnect', function (ctx) {
    console.log('Disconnected: ' + ctx.reason);
});
function handleSubscribe(ctx) {
    console.log('Subscribed on channel ' + ctx.channel + ' (resubscribed: ' + ctx.isResubscribe + ', recovered: ' + ctx.recovered + ')')
}

function handleSubscribeError(err) {
    console.log('Error subscribing on channel ' + err.channel + ': ' + err.message)
}

function handleReceiveMessage(message) {
    console.log(message)
}

function handleJoin(message) {
    console.log('Client joined channel ' + this.channel + ' (uid: ' + message.info['client'] + ', user: ' + message.info['user'] + ')')
}

function handleLeave(message) {
    console.log('Client left channel ' + this.channel + ' (uid: ' + message.info['client'] + ', user: ' + message.info['user'] + ')')
}

function handleUnsubscribe(sub) {
    console.log('Unsubscribed from channel ' + sub.channel)
}

// Notifications
function DefaultNotify(msg) {
    Vue.notify({
        group: "notifications",
        title: "Thông báo",
        text: msg,
        duration: 6000,
        width: "400px"
    });
}
function WarnNotify(msg) {
    Vue.notify({
        group: "notifications",
        title: "Thông báo",
        text: msg,
        duration: 6000,
        type: "warn",
        width: "400px"
    });
}
function ErrorNotify(msg) {
    Vue.notify({
        group: "notifications",
        title: "Thông báo",
        text: msg,
        duration: 6000,
        type: "error",
        width: "400px"
    });
}
function SuccessNotify(msg) {
    Vue.notify({
        group: "notifications",
        title: "Thông báo",
        text: msg,
        duration: 6000,
        type: "success",
        width: "400px"
    });
}

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

    // Subscribe a specific channel
    SubscribeChannel: function (channel, handlerFunc) {
        centrifuge.subscribe(channel, handlerFunc)
    },

    // Publish a message to default channel
    Publish: function (type, msg) {
        return new Promise((resolve, reject) => {
            var sendMsg = { 'type': type, 'message': msg };
            centrifuge.publish(defaultChannel, sendMsg).then(function (res) {
                resolve('successfully published');
            }, function (err) {
                reject('publish error');
            });
        })
    },

    // Publish a message to a specific channel
    PublishToChannel: function (channel, type, msg) {
        return new Promise((resolve, reject) => {
            var sendMsg = { 'type': type, 'message': msg };
            centrifuge.publish(channel, sendMsg).then(function (res) {
                resolve('successfully published');
            }, function (err) {
                reject('publish error');
            });
        })
    }
}
