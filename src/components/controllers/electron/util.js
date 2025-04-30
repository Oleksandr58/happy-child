const { app } = require('electron')
const path = require('path')

function getUIPath() {
    return path.join(app.getAppPath(), '/frontend/index.html');
}

function isDev() {
    return process.env.NODE_ENV === 'development';
}

exports.getUIPath = getUIPath
exports.isDev = isDev