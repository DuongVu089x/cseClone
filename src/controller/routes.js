module.exports = app => {
    ['/admin', '/admin/settings',
        '/admin/profile',
        '/admin/email', '/admin/user',
        '/admin/carousel', '/admin/carousel/edit/:carouselId',
        '/admin/content', '/admin/content/edit/:contentId',
        '/admin/menu', '/admin/menu/edit/:menuId',
        '/admin/slogan', '/admin/slogan/edit/:sloganId',
        '/admin/video',
        '/admin/statistic', '/admin/statistic/edit/:statisticId',
        '/admin/staff', '/admin/staff/edit/:staffId',
        '/admin/staff-group', '/admin/staff-group/edit/:staffGroupId',
        '/admin/division', '/admin/division/edit/:divisionId',
        '/admin/testimony', '/admin/testimony/edit/:testimonyId',
        '/admin/news/category', '/admin/news/list', '/admin/news/edit/:newsId',
        '/admin/contact', '/admin/contact/read/:contactId',
        '/admin/subscriber',
        '/admin/vySociu', '/admin/vySociu/edit/:vySociuId',
        '/admin/demo2', '/admin/demo2/edit/:demo2Id'
    ].forEach(route => app.get(route, app.role.isAdmin, (req, res) => app.createResponse(req, res, '/admin.template')));

    app.put('/admin/system', app.role.isAdmin, (req, res) => {
        const changes = {};

        if (req.body.currentPassword) {
            if (req.body.currentPassword == app.data.emailPassword) {
                changes.emailPassword = req.body.newPassword;
                app.model.setting.set(changes, error => {
                    if (error) {
                        res.send({
                            error: 'Lỗi khi cập nhật mật khẩu email!'
                        });
                    } else {
                        app.data.emailPassword = req.body.emailPassword;
                        res.send(app.data);
                    }
                });
            } else {
                res.send({
                    error: 'Mật khẩu hiện tại không đúng!'
                });
            }
        } else {
            if (req.body.address != null || req.body.address == '') {
                changes.address = req.body.address.trim();
            }
            if (req.body.email && req.body.email != '') {
                changes.email = req.body.email.trim();
            }
            if (req.body.mobile != null || req.body.mobile == '') {
                changes.mobile = req.body.mobile.trim();
            }
            if (req.body.fax != null || req.body.fax == '') {
                changes.fax = req.body.fax.trim();
            }
            if (req.body.facebook != null || req.body.facebook == '') {
                changes.facebook = req.body.facebook.trim();
            }
            if (req.body.youtube != null || req.body.youtube == '') {
                changes.youtube = req.body.youtube.trim();
            }
            if (req.body.twitter != null || req.body.twitter == '') {
                changes.twitter = req.body.twitter.trim();
            }
            if (req.body.instagram != null || req.body.instagram == '') {
                changes.instagram = req.body.instagram.trim();
            }
            if (req.body.headerText != null || req.body.headerText == '') {
                changes.headerText = req.body.headerText.trim();
            }
            if (req.body.hotNewsActive != null || req.body.hotNewsActive == '') {
                changes.hotNewsActive = req.body.hotNewsActive.trim();
            }
            if (req.body.hotNewsTitle != null || req.body.hotNewsTitle == '') {
                changes.hotNewsTitle = req.body.hotNewsTitle.trim();
            }
            if (req.body.hotNewsUrl != null || req.body.hotNewsUrl == '') {
                changes.hotNewsUrl = req.body.hotNewsUrl.trim();
            }
            if (req.body.hotNewsImage == '') {
                changes.hotNewsImage = '';
                app.deleteImage(app.data.hotNewsImage);
            }
            if (req.body.hotNewsDescription != null || req.body.hotNewsDescription == '') {
                changes.hotNewsDescription = req.body.hotNewsDescription.trim();
            }
            if (req.body.latitude != null || req.body.latitude == '') {
                changes.latitude = req.body.latitude.trim();
            }
            if (req.body.longitude != null || req.body.longitude == '') {
                changes.longitude = req.body.longitude.trim();
            }

            app.model.setting.set(changes, error => {
                if (error) {
                    res.send({
                        error: 'Lỗi khi cập nhật mật khẩu email!'
                    });
                } else {
                    app.data = app.clone(app.data, changes);
                    res.send(app.data);
                }
            });
        }
    });

    // Home -----------------------------------------------------------------------------------------------------------------------------------------
    ['/index.htm(l)?', '/contact(.htm(l)?)?', '/registered(.htm(l)?)?', '/404.htm(l)?',
        '/active-user/:userId', '/forgot-password/:userId/:userToken',
        '/news/item/:newsId', '/tintuc/:link',
        '/division/item/:divisionID',
    ].forEach(route => app.get(route, (req, res) => app.createResponse(req, res, '/home.template')));

    app.get('/home/state', (req, res) => {
        const data = app.clone(app.data, {
            emailPassword: '',
            user: req.session.user ? app.clone(req.session.user, {
                password: '',
                token: '',
                tokenDate: ''
            }) : null,
        });

        app.model.menu.getAll({
            active: true
        }, (error, menus) => {
            if (menus) {
                data.menus = menus.slice();
                data.menus.forEach(menu => {
                    menu.content = '';
                    if (menu.submenus) {
                        menu.submenus.forEach(submenu => submenu.content = '');
                    }
                });
            }

            const role = req.session.user ? req.session.user.role.toString().trim().toLowerCase() : '';
            if (role == 'admin') {
                res.send(app.clone(data, {
                    numberOfUser: 0,
                    numberOfNews: 0,
                    user: req.session.user,
                }));
            } else {
                res.send(app.clone(data, {
                    numberOfUser: 0,
                    numberOfNews: 0,
                    user: req.session.user,
                }));
            }
        });
    });

    // app.get('/home/division/all', (req, res) =>
    //     app.model.division.getAll((error, items) => res.send({ error, items })));
    app.post('/menu', (req, res) => {
        const menu = app.menus[req.body.link];
        if (menu) {
            const menuComponents = [];
            const getComponent = (index, componentIds, components, done) => {
                if (index < componentIds.length) {
                    app.model.component.get(componentIds[index], (error, component) => {
                        if (error || component == null) {
                            getComponent(index + 1, componentIds, components, done);
                        } else {
                            component = app.clone(component);
                            component.components = [];
                            components.push(component);

                            const getNextComponent = view => {
                                if (view) component.view = view;
                                if (component.componentIds) {
                                    getComponent(0, component.componentIds, component.components, () =>
                                        getComponent(index + 1, componentIds, components, done));
                                } else {
                                    getComponent(index + 1, componentIds, components, done);
                                }
                            }

                            if (component.viewType && component.viewId) {
                                const viewType = component.viewType;
                                if (component.viewId && (viewType == 'carousel' || viewType == 'content' || viewType == 'news')) {
                                    app.model[viewType].get(component.viewId, (error, item) => getNextComponent(item));
                                } else if (viewType == 'news feed' || viewType == 'all news') {
                                    getNextComponent();
                                } else { //TODO: news, event, job
                                    getNextComponent();
                                }
                            } else {
                                getNextComponent();
                            }
                        }
                    });
                } else {
                    done();
                }
            }

            if (menu.component) {
                res.send(menu.component);
            } else if (menu.componentId) {
                getComponent(0, [menu.componentId], menuComponents, () => {
                    menu.component = menuComponents[0];
                    res.send(menu.component);
                });
            } else {
                res.send({
                    error: 'Menu không hợp lệ!'
                });
            }
        } else {
            res.send({
                error: 'Link không hợp lệ!'
            });
        }
    });

    app.redirectToWebpackServer();
};