module.exports = app => {
    app.get('/admin/news/page/:pageNumber/:pageSize', app.role.isAdmin, (req, res) => {
        const pageNumber = parseInt(req.params.pageNumber),
            pageSize = parseInt(req.params.pageSize);
        app.model.news.getPage(pageNumber, pageSize, {}, (error, page) => {
            const respone = {};
            if (error || page == null) {
                respone.error = 'Danh sách tin tức không sẵn sàng!';
            } else {
                let list = page.list.map(item => app.clone(item, { content: null }));
                respone.page = app.clone(page, { list });
            }
            res.send(respone);
        });
    });

    app.post('/admin/news/default', app.role.isAdmin, (req, res) => {
        app.model.news.create({ title: 'Bài viết', active: false }, (error, item) => res.send({ error, item }));
    });

    app.delete('/admin/news', app.role.isAdmin, (req, res) => {
        app.model.news.delete(req.body._id, error => res.send({ error }));
    });

    app.put('/admin/news/swap', app.role.isAdmin, (req, res) => {
        const isMoveUp = req.body.isMoveUp.toString() == 'true';
        app.model.news.swapPriority(req.body._id, isMoveUp, error => res.send({ error }));
    });

    app.put('/admin/news', app.role.isAdmin, (req, res) => {
        app.model.news.update(req.body._id, req.body.changes, (error, item) => res.send({ error, item }));
    });

    app.get('/admin/news/item/:newsId', app.role.isAdmin, (req, res) => {
        app.model.category.getAll('news', (error, categories) => {
            if (error || categories == null) {
                res.send({ error: 'Lỗi khi lấy danh mục!' });
            } else {
                app.model.news.get(req.params.newsId, (error, item) => {
                    res.send({
                        error,
                        categories: categories.map(item => ({ id: item._id, text: item.title })),
                        item
                    });
                });
            }
        });
    });


    // Editor ---------------------------------------------------------------------------------------------------------------------------------------    
    const getNewsInDraftWithId = (id) => new Promise((resolve, reject) => {
        app.model.draft.find({action: 'update', type: 'news'}, (error, drafts) => {
            if (error || drafts == null || drafts.length === 0) reject(new Error(error));
            else {
                for (let i = 0; i < drafts.length; i++) {
                    if (drafts[i].data.id == id) resolve(drafts[i]);
                }
                reject('NaN');
            }
        })
    });

    app.get('/editor/news/page/:pageNumber/:pageSize', app.role.isEditor, (req, res) => {
        const pageNumber = parseInt(req.params.pageNumber),
            pageSize = parseInt(req.params.pageSize);
        if (pageSize <= 0 || pageNumber <= 0) {
            res.send({error: 'Không tìm thấy trang!'});
            return;
        }

        const getCount = (modelName, condition) => new Promise((resolve, reject) => {
            app.model[modelName].count(condition, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        const getWithRange = (modelName, from, to, condition) => new Promise((resolve, reject) => {
            app.model[modelName].getWithRange(from, to, condition, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        });

        getCount('draft', {type: 'news'})
            .then(draftCount => {
                return getCount('news', {})
                    .then(newsCount => Promise.resolve({draftCount, newsCount}))
                    .catch(error => Promise.reject(error));
            })
            .then(data => {
                let condition = { type: 'news', action: 'update'};
                if (data.draftCount !== 0) {
                    return getWithRange('draft', 0, data.draftCount, condition)
                        .then(result => Promise.resolve(Object.assign({}, data, {updateNews: result.drafts})))
                        .catch(error => Promise.reject(error));
                } else return Promise.resolve(Object.assign({}, data, {updateNews: []}));
            })
            .then(data => {
                let fromIndex = (pageNumber - 1) * pageSize,
                    toIndex = pageNumber * pageSize;
                if (toIndex <= data.draftCount) {
                    let condition = {type: 'news'};
                    return getWithRange('draft', fromIndex, toIndex, condition)
                        .then(news => Promise.resolve(Object.assign({}, data, {drafts: news.drafts})))
                        .catch(error => Promise.reject(error));
                }
                if (fromIndex < data.draftCount) {
                    let condition = {type: 'news'};
                    return getWithRange('draft', fromIndex, data.draftCount, condition)
                        .then(news => Promise.resolve(Object.assign({}, data, {drafts: news.drafts})))
                        .then(dt => {
                            let toNews = toIndex - data.draftCount;
                            return getWithRange('news', 0, toNews, {})
                                .then(news => {
                                    dt.listNews = [];
                                    news.news.forEach(item => {
                                        let checker = dt.updateNews.findIndex(i => i.data.id == item._id) !== -1;
                                        dt.listNews.push({
                                            modified: checker,
                                            news: item
                                        })
                                    });
                                    return Promise.resolve(dt);
                                }).catch(error => Promise.reject(error));
                        })
                        .catch(error => Promise.reject(error));
                }
                let fromNews = fromIndex - data.draftCount;
                return getWithRange('news', fromNews, fromNews + pageSize, {})
                    .then(news => {
                        data.listNews = [];
                        news.news.forEach(item => {
                            let checker = data.updateNews.findIndex(i => i.data.id == item._id) !== -1;
                            data.listNews.push({
                                modified: checker,
                                news: item
                            })
                        });
                        return Promise.resolve(data);
                    }).catch(error => Promise.reject(error));

            })
            .then(data => Object.assign({}, data, {
                updateNews: null,
                pageNumber,
                pageSize,
                pageTotal: parseInt((data.draftCount + data.newsCount - 1) / pageSize) + 1,
                totalItem: data.draftCount + data.newsCount,
            }))
            .then(data => res.send({error: null, data}))
            .catch(error => res.send({error, data: null}));
    });

    app.get('/editor/news/item/:id', app.role.isEditor, (req, res) => {
        app.model.category.getAll('news', (error, categories) => {
            if (error || categories == null) {
                res.send({ error: 'Lỗi khi lấy danh mục!' });
            } else {
                app.model.draft.get(req.params.id, (error, item) => {
                    res.send({
                        error,
                        categories: categories.map(item => ({ id: item._id, text: item.title })),
                        item
                    });
                });
            }
        });
    });

    app.get('/editor/news/clone/:id', app.role.isEditor, (req, res) => {
        app.model.news.get(req.params.id, (error, news) => {
            if (error) res.send(error);
            else {
                getNewsInDraftWithId(req.params.id)
                    .then(draft => res.send({error: 'Bài viết đang được chỉnh sửa!'}))
                    .catch(error => {
                        let newsCloned = {
                            id: news._id,
                            categories: news.categories,
                            title: news.title,
                            image: news.image,
                            link: news.link,
                            abstract: news.abstract,
                            content: news.content,
                            startPost: news.startPost,
                            stopPost: news.stopPost,
                        };
                        let document = {
                            editor: req.session.user._id,
                            type: 'news',
                            data: newsCloned,
                            action: 'update'
                        };
                        app.model.draft.create(document, (err, draft) => res.send({error:err, draft}));
                    })
            }
        });
    });

    app.get('/editor/draft/:newsId', app.role.isEditor, (req, res) => {
        getNewsInDraftWithId(req.params.newsId)
            .then(draft => res.send({error: null, draft}))
            .catch(error => res.send(error));
    });

    app.post('/editor/news/default', app.role.isEditor, (req, res) => {
        let news = {
            title: 'Bài viết',
        };
        let document = {
            editor: req.session.user._id,
            type: 'news',
            data: news,
            action: 'create'
        };
        app.model.draft.create(document, (error, draft) => res.send({error, draft}));
    });

    app.post('/editor/news/edit/:id', app.role.isEditor, (req, res) => {
        const insertNewDraft = () => {
            app.model.news.get(req.params.id, (error, data) => {
                if (error) {
                    res.send({error})
                } else {
                    app.model.draft.getByObjectId(data._id, (e, d) => {
                        let news = {
                            id: data._id,
                            categories: req.body.news.categories,
                            title: req.body.news.title,
                            image: req.body.news.image,
                            link: req.body.news.link,
                            abstract: req.body.news.abstract,
                            content: req.body.news.content,
                            startPost: req.body.news.startPost,
                            stopPost: req.body.news.stopPost,
                        };
                        let document = {
                            editor: req.session.user._id,
                            type: 'news',
                            data: news,
                            action: 'update'
                        };
                        e != null && app.model.draft.create(document, (err, draft) => res.send({error:err, draft}));
                        (d != null || d != undefined) && res.send({error: 'Bài viết đang được chỉnh sửa!'});
                    });
                }
            });
        }

        getNewsInDraftWithId(req.params.id)
            .then(drafts => {
                res.send({error: 'This new is already modified!'})
            })
            .catch(() => insertNewDraft());
    });

    app.put('/editor/news', app.role.isEditor, (req, res) => {
        app.model.draft.update(req.body._id, req.body.changes, (error, item) => res.send({ error, item }));
    });

    app.delete('/editor/news', app.role.isEditor, (req, res) => {
        app.model.draft.delete(req.body._id, error => res.send({ error }));
    });

    // Home -----------------------------------------------------------------------------------------------------------------------------------------
    app.get('/news/page/:pageNumber/:pageSize', (req, res) => {
        const pageNumber = parseInt(req.params.pageNumber),
            pageSize = parseInt(req.params.pageSize),
            today = new Date(), yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const condition = {
            $or: [{ startPost: null }, { startPost: { $exists: false } }, { startPost: { $lte: today } },],
            $or: [{ stopPost: null }, { stopPost: { $exists: false } }, { stopPost: { $gte: yesterday } },],
            active: true
        };

        app.model.news.getPage(pageNumber, pageSize, condition, (error, page) => {
            const respone = {};
            if (error || page == null) {
                respone.error = 'Danh sách tin tức không sẵn sàng!';
            } else {
                let list = page.list.map(item => app.clone(item, { content: null }));
                respone.page = app.clone(page, { list });
            }
            res.send(respone);
        });
    });

    app.get('/news/page/:pageNumber/:pageSize/:categoryType', (req, res) => {
        const pageNumber = parseInt(req.params.pageNumber),
            pageSize = parseInt(req.params.pageSize),
            today = new Date(), yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const condition = {
            categories: req.params.categoryType,
            $or: [{ startPost: null }, { startPost: { $exists: false } }, { startPost: { $lte: today } },],
            $or: [{ stopPost: null }, { stopPost: { $exists: false } }, { stopPost: { $gte: yesterday } },],
            active: true
        };

        app.model.news.getPage(pageNumber, pageSize, condition, (error, page) => {
            const respone = {};
            if (error || page == null) {
                respone.error = 'Danh sách tin tức không sẵn sàng!';
            } else {
                let list = page.list.map(item => app.clone(item, { content: null }));
                respone.page = app.clone(page, { list });
            }
            res.send(respone);
        });
    });

    app.get('/news/item/id/:newsId', (req, res) => {
        app.model.news.readById(req.params.newsId, (error, item) => res.send({ error, item }));
    });
    app.get('/news/item/link/:newsLink', (req, res) => {
        app.model.news.readByLink(req.params.newsLink, (error, item) => res.send({ error, item }));
    });

    app.put('/news/item/check-link', (req, res) => {
        app.model.news.getByLink(req.body.link, (error, item) => {
            res.send({
                error: error ? 'Lỗi hệ thống' : (item == null || item._id == req.body._id) ? null : 'Link không hợp lệ'
            });
        });
    });
};