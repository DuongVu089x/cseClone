module.exports = app => {

    app.initAppMenus = menuTree => {
        const menus = {},
            getMenu = (index, items, done) => {
                if (index < items.length) {
                    const item = items[index];
                    menus[item.link] = item;

                    if (item.submenus && item.submenus.length > 0) {
                        getMenu(0, item.submenus, () => getMenu(index + 1, items, done));
                    } else {
                        getMenu(index + 1, items, done);
                    }
                } else {
                    done();
                }
            };

        if (menuTree) {
            getMenu(0, menuTree, () => app.menus = menus);
        } else {
            app.model.menu.getAll({}, (error, menuTree) => getMenu(0, menuTree, () => app.menus = menus));
        }
    }
    app.initAppMenus();

    app.get('/admin/menu/all', app.role.isAdmin, (req, res) => app.model.menu.getAll({}, (error, menuTree) => {
        app.initAppMenus(menuTree);
        res.send({ error, items: menuTree });
    }));

    app.get('/admin/menu/:menuId', app.role.isAdmin, (req, res) => app.model.menu.get(req.params.menuId, (error, menu) => {
        if (error || menu == null) {
            return res.send({ error: 'Lỗi khi lấy menu!' });
        }

        const menuComponentIds = [],
            menuComponents = [];
        const getComponent = (level, index, componentIds, components, done) => {
            if (index < componentIds.length) {
                app.model.component.get(componentIds[index], (error, component) => {
                    if (error || component == null) {
                        return res.send({ error: 'Lỗi khi lấy thành phần trang!' });
                    }

                    component = app.clone(component);
                    component.components = [];
                    components.push(component);

                    const getNextComponent = (viewName) => {
                        component.viewName = viewName;
                        if (component.componentIds) {
                            getComponent(level + 1, 0, component.componentIds, component.components, () => {
                                getComponent(level, index + 1, componentIds, components, done);
                            });
                        } else {
                            getComponent(level, index + 1, componentIds, components, done);
                        }
                    }
                    if (component.viewType && component.viewId) {
                        const viewType = component.viewType;
                        if (component.viewId && (['carousel', 'content', 'news', 'event', 'job', 'testimony', 'video', 'statistic', 'slogan'].indexOf(viewType) != -1)) {
                            app.model[viewType].get(component.viewId, (error, item) =>
                                getNextComponent(item ? item.title : '<empty>'));
                        } else if (component.viewId && viewType == 'staff group') {
                            app.model.staffGroup.get(component.viewId, (error, item) =>
                                getNextComponent(item ? item.title : '<empty>'));
                        } else if (['all news', 'all events', 'all jobs', 'last news', 'last events', 'last jobs', 'subscribe', 'all divisions'].indexOf(viewType) != -1) {
                            getNextComponent(viewType);
                        } else {
                            getNextComponent('<empty>');
                        }
                    } else {
                        getNextComponent('<empty>');
                    }
                });
            } else {
                done();
            }
        }

        const getAllComponents = () => {
            menuComponentIds.push(menu.componentId);
            getComponent(0, 0, menuComponentIds, menuComponents, () => {
                menu = app.clone(menu);
                menu.component = menuComponents[0];
                res.send({ menu });
            });
        }

        if (menu.componentId == null || menu.componentId == undefined) {
            app.model.component.create({ className: 'container', viewType: '<empty>' }, (error, component) => {
                menu.componentId = component._id;
                menu.save(getAllComponents);
            });
        } else {
            getAllComponents();
        }
    }));

    app.post('/admin/menu', app.role.isAdmin, (req, res) => {
        const data = { title: 'Tên menu', link: '#', active: false };
        if (req.body._id) data.parentId = req.body._id;
        app.model.menu.create(data, (error, item) => res.send({ error, item }));
    });

    app.post('/admin/menu/build', app.role.isAdmin, (req, res) => {
        app.initAppMenus();
        res.send('OK');
    });

    app.put('/admin/menu', app.role.isAdmin, (req, res) =>
        app.model.menu.update(req.body._id, req.body.changes, (error, item) => res.send({ error, item })));

    app.put('/admin/menu/swap', app.role.isAdmin, (req, res) => {
        const isMoveUp = req.body.isMoveUp.toString() == 'true';
        app.model.menu.swapPriority(req.body._id, isMoveUp, error => res.send({
            error
        }));
    });

    app.delete('/admin/menu', app.role.isAdmin, (req, res) => app.model.menu.delete(req.body._id, error => res.send({ error })));


    app.post('/admin/menu/component', app.role.isAdmin, (req, res) => {
        app.model.component.get(req.body.parentId, (error, parent) => {
            if (error || parent == null) {
                return res.send({ error: 'Id không chính xác!' });
            }

            const data = app.clone(req.body.component);
            data.componentIds = [];
            app.model.component.create(data, (error, component) => {
                if (error || component == null) {
                    if (error) console.log(error);
                    return res.send({ error: 'Tạo component bị lỗi!' });
                }

                parent.componentIds.push(component._id);
                parent.save(error => res.send({ error, component }));
            });
        });
    });

    app.put('/admin/menu/component', app.role.isAdmin, (req, res) =>
        app.model.component.update(req.body._id, req.body.changes, error => res.send({ error })));

    app.put('/admin/menu/component/swap', app.role.isAdmin, (req, res) => {
        const isMoveUp = req.body.isMoveUp.toString() == 'true';
        app.model.component.swapPriority(req.body._id, isMoveUp, error => res.send({ error }));
    });

    app.delete('/admin/menu/component', app.role.isAdmin, (req, res) => {
        app.model.component.delete(req.body._id, (error) => res.send({ error }));
    });

    app.put('/admin/menu/build', app.role.isAdmin, (req, res) => {
        app.initAppMenus();
        res.send('OK')
    });



    app.get('/admin/menu/component/type/:pageType', app.role.isAdmin, (req, res) => {
        const pageType = req.params.pageType;
        if (pageType == 'carousel') {
            app.model.carousel.getAll((error, items) => {
                res.send({
                    error,
                    items: items.map(item => ({ _id: item._id, text: item.title }))
                })
            });
        } else if (pageType == 'staff group') {
            app.model.staffGroup.getAll((error, items) => {
                res.send({
                    error,
                    items: items.map(item => ({ _id: item._id, text: item.title }))
                })
            });
        } else if (pageType == 'testimony') {
            app.model.testimony.getAll((error, items) => {
                res.send({
                    error,
                    items: items.map(item => ({ _id: item._id, text: item.title }))
                })
            });
        } else if (pageType == 'slogan') {
            app.model.slogan.getAll((error, items) => {
                res.send({
                    error,
                    items: items.map(item => ({ _id: item._id, text: item.title }))
                })
            });
        } else if (pageType == 'video') {
            app.model.video.getAll((error, items) => {
                res.send({
                    error,
                    items: items.map(item => ({ _id: item._id, text: item.title }))
                })
            });
        } else if (pageType == 'content') {
            app.model.content.getAll((error, items) => {
                res.send({
                    error,
                    items: items.map(item => ({
                        _id: item._id,
                        text: item.title
                    }))
                })
            });
        } else if (pageType == 'news') {
            app.model.news.getAll((error, items) => {
                res.send({
                    error,
                    items: items.map(item => ({
                        _id: item._id,
                        text: item.title
                    }))
                })
            });
        } else if (pageType == 'event') {
            app.model.event.getAll((error, items) => {
                res.send({
                    error,
                    items: items.map(item => ({
                        _id: item._id,
                        text: item.title
                    }))
                })
            });
        } else if (pageType == 'job') {
            app.model.job.getAll((error, items) => {
                res.send({
                    error,
                    items: items.map(item => ({
                        _id: item._id,
                        text: item.title
                    }))
                })
            });
        } else if (pageType == 'statistic') {
            app.model.statistic.getAll((error, items) => {
                res.send({
                    error,
                    items: items.map(item => ({
                        _id: item._id,
                        text: item.title
                    }))
                })
            });
        } else {
            res.send({
                error: 'Lỗi!'
            });
        }
    });
};