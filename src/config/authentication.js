module.exports = app => {
    app.role = {
        list: ['admin', 'editor', 'user'],
        debugUser: {
            admin: {
                firstname: 'Admin',
                lastname: 'Admin',
                email: app.defaultAdminEmail,
                password: app.defaultAdminPassword,
                active: true
            },
            editor: {
                firstname: 'Editor',
                lastname: 'Editor',
                email: 'editor@hcmut.edu.vn',
                password: '123456',
                active: true
            },
            user: {
                firstname: 'User',
                lastname: 'User',
                email: 'hithanhtung@gmail.com',
                password: '123456',
                active: true
            },
        }
    };

    const debugAsUser = (req, next, role, error) => {
        if (app.isDebug && app.autoLogin) {
            const email = app.role.debugUser[role].email;
            app.model.user.getByEmail(email, (error, user) => {
                if (error || user == null) {
                    console.error('Debug as ' + email + ' has errors!');
                } else {
                    req.session.user = user;
                    console.log('Debug as ' + req.session.user.role + '!');
                }
                next();
            });
        } else {
            error && error();
        }
    };
    app.role.list.forEach(role => app.role['is' + role.upFirstChar()] = (req, res, next) => {
        const isGetMethod = req.method.toLowerCase() === 'get';
        if (req.session.user == null) {
            debugAsUser(req, next, role, () => {
                if (isGetMethod) {
                    res.redirect('/request-login/' + role);
                } else {
                    res.send({ error: 'You must login as ' + role + '!' });
                }
            });
        } else if (req.session.user.role === role) {
            next();
        } else {
            debugAsUser(role, next, role, () => {
                if (isGetMethod) {
                    res.redirect('/request-permissions/' + role);
                } else {
                    res.send({ error: 'Insufficient user permissions!' });
                }
            });
        }
    });

    app.isLoginedUser = (req, res, next) => {
        if (req.session.user != null) {
            next();
        } else if (req.method.toLowerCase() === 'get') {
            res.redirect('/');
        } else {
            res.send({ error: 'You must login first!' });
        }
    };
    app.isGuest = (req, res, next) => {
        if (req.session.user == null) {
            next();
        } else if (req.method.toLowerCase() === 'get') {
            res.redirect('/');
        } else {
            res.send({ error: 'You has logged in!' });
        }
    };


    app.createDebugUser = () => {
        if (app.isDebug) {
            Object.keys(app.role.debugUser).forEach(role => {
                let user = app.role.debugUser[role];
                user.role = role;
                app.model.user.create(user, () => { });
            });
        } else {
            app.model.user.create({
                firstname: 'Admin',
                lastname: 'Admin',
                email: app.defaultAdminEmail,
                password: app.defaultAdminPassword,
                role: 'admin',
                active: true,
            });
        }
    };

    app.registerUser = (req, res, role) => {
        if (req.session.user != null) {
            res.send({ error: 'You are logged in!' });
        } else {
            let data = {
                name: req.body.name.trim(),
                email: req.body.email.trim(),
                password: req.body.password,
                role: role,
                active: req.body.active !== undefined && req.body.active != null ? req.body.active : false
            };
            app.model.user.create(data, (error, user) => {
                if (error) {
                    res.send({ error });
                } else if (user == null) {
                    res.send({ error: 'The registration process has some errors! Please try later. Thank you.' });
                } else {
                    res.send({ error: null, user: app.clone({}, user, { password: null }) });

                    app.model.setting.get(['emailRegisterMemberTitle', 'emailRegisterMemberText', 'emailRegisterMemberHtml'], result => {
                        let url = (app.isDebug ? app.debugUrl : app.rootUrl) + '/active-user/' + user._id,
                            mailTitle = result.emailRegisterMemberTitle,
                            mailText = result.emailRegisterMemberText.replaceAll('{name}', user.name).replaceAll('{url}', url),
                            mailHtml = result.emailRegisterMemberHtml.replaceAll('{name}', user.name).replaceAll('{url}', url);
                        app.email.sendEmail(data.email, app.mailCc, mailTitle, mailText, mailHtml, null);
                    });
                }
            });
        }
    };
    app.loginUser = (req, res) => {
        if (req.session.user != null) {
            res.send({ error: 'You are logged in!' });
        } else {
            let email = req.body.email.trim(),
                password = req.body.password;
            app.model.user.auth(email, password, user => {
                if (user == null) {
                    res.send({ error: 'Invalid email or password!' });
                } else if (user.active) {
                    req.session.user = user;
                    res.send({ user: app.clone({}, user, { password: null }) });
                } else {
                    res.send({ error: 'Your account is inactive!' });
                }
            });
        }
    };
    app.logoutUser = (req, res) => {
        req.session.user = null;
        req.session.today = null;
        res.send({ error: null });
    };

    app.registerUserOnMobile = (socket, name, phoneNumber, email, password) => {
        if (socket.user != null) {
            socket.emit('user:register', 'You are logged in!');
        } else {
            app.model.user.create({
                name,
                phoneNumber,
                email,
                password,
                role: 'user',
                active: false
            }, (error, user) => {
                if (error) {
                    socket.emit('user:register', error);
                } else if (user == null) {
                    socket.emit('user:register', 'The registration process has some errors! Please try later. Thank you.');
                } else {
                    // user.password = null;
                    socket.emit('user:register', null);
                }
            });
        }
    };
    app.loginUserOnMobile = (socket, email, password) => {
        if (socket.user != null) {
            socket.emit('user:auth-changed', { error: 'You are logged in!', user: socket.user });
        } else {
            app.model.user.auth(email.toString().trim(), password.toString(), user => {
                if (user == null) {
                    socket.emit('user:login-fail', 'Invalid email or password!');
                    socket.emit('user:auth-changed', { error: 'Invalid email or password!' });
                } else if (user.active) {
                    socket.user = user;
                    socket.emit('user:auth-changed', { user });
                } else {
                    socket.emit('user:login-fail', 'Your account is inactive!');
                    socket.emit('user:auth-changed', { error: 'Your account is inactive!' });
                }
            });
        }

        socket.emit('user:auth-changed', { error: null, user: null });
    };
    app.logoutUserOnMobile = (socket) => {
        socket.user = null;
        socket.emit('user:auth-changed', { error: null, user: null });
    };
};