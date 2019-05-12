module.exports = app => {
    app.get('/admin/content/all', app.role.isAdmin, (req, res) =>
        app.model.content.getAll((error, items) => res.send({ error, items })));

    app.get('/admin/content/item/:contentId', app.role.isAdmin, (req, res) =>
        app.model.content.get(req.params.contentId, (error, item) => res.send({ error, item })));

    app.post('/admin/content', app.role.isAdmin, (req, res) =>
        app.model.content.create({ title: 'Tiêu đề', active: false }, (error, item) => res.send({ error, item })));

    app.put('/admin/content', app.role.isAdmin, (req, res) =>
        app.model.content.update(req.body._id, req.body.changes, (error, item) => res.send({ error, item })));

    app.delete('/admin/content', app.role.isAdmin, (req, res) => app.model.content.delete(req.body.id, error => res.send({ error })));
};