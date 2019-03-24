const package = require('./package');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
app.fs = require('fs');
app.path = require('path');

// Variables ==================================================================
app.title = package.title;
app.port = package.port;
app.version = package.version;
app.description = package.description;
app.keywords = package.keywords ? JSON.stringify(package.keywords) : '';
app.isDebug = !__dirname.startsWith('/var/www/');
// app.isDebug = false;
app.autoLogin = package.autoLogin;
app.rootUrl = package.rootUrl;
app.mongodb = 'mongodb://localhost:27017/' + package.dbName;
app.email = package.email;
app.mailCc = ['hithanhtung@gmail.com'];
app.mailAdmin = ['thanhtung@hcmut.edu.vn'];
app.defaultAdminEmail = 'tuongVy@gmail.com';
app.defaultAdminPassword = 'tuongvy';
app.assetPath = app.path.join(__dirname, 'asset');
app.srcPath = app.path.join(__dirname, package.path.src);
app.viewPath = app.path.join(__dirname, package.path.view);
app.modelPath = app.path.join(__dirname, package.path.model);
app.controllerPath = app.path.join(__dirname, package.path.controller);
app.publicPath = app.path.join(__dirname, package.path.public);
app.imagePath = app.path.join(package.path.public, 'img');
app.logPath = app.path.join(__dirname, package.path.log);
app.uploadPath = app.path.join(__dirname, package.path.upload);
app.faviconPath = app.path.join(__dirname, package.path.favicon);

// Configure ==================================================================
require('./src/config/common')(app);
require('./src/config/view')(app, express);
require('./src/config/packages')(app, server);
require('./src/config/database')(app);
require('./src/config/authentication')(app);
require('./src/config/io')(app, server);

// Init =======================================================================
app.loadModels();
app.loadControllers();
app.createFolder([app.publicPath, app.uploadPath]);
if (!app.isDebug) app.createFolder(app.logPath);

// Default route ==============================================================
app.get('*', (req, res, next) => {
    app.model.menu.getByLink(req.path, (error, menu) => {
        if (error || menu == null) {
            console.log(1231123)
            next();
        } else {
            app.createResponse(req, res, '/home.template');
        }
    });

});
require('./src/config/error')(app);

app.model.user.getAll((error, users) => {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.name) {
            const name = user.name.trim(),
                index = name.lastIndexOf(' ');
            if (index >= 0) {
                user.lastname = name.substring(0, index).trim(); // Họ
                user.firstname = name.substring(index).trim(); // Tên
            } else {
                user.lastname = name;
            }
            user.save();
        }
    }
});

// Launch website =============================================================
app.keywords = (app.keywords && app.keywords.length > 2 ? app.keywords.substring(2, app.keywords.length - 2) : '').replaceAll('","', ', ');
app.debugUrl = 'http://localhost:' + app.port;
server.listen(app.port, () => console.log(' - ' + app.title + ' on ' + app.debugUrl + '.'));