module.exports = app => {
    app.get('/admin/testimony/all', app.role.isAdmin, (req, res) =>
        app.model.testimony.getAll((error, items) => res.send({ error, items })));

    app.get('/admin/testimony/item/:testimonyId', app.role.isAdmin, (req, res) =>
        app.model.testimony.get(req.params.testimonyId, (error, item) => res.send({ error, item })));

    app.post('/admin/testimony', app.role.isAdmin, (req, res) =>
        app.model.testimony.create({ title: req.body.title }, (error, item) => res.send({ error, item })));

    app.put('/admin/testimony', app.role.isAdmin, (req, res) =>
        app.model.testimony.update(req.body._id, req.body.changes, (error, item) => res.send({ error, item })));

    app.delete('/admin/testimony', app.role.isAdmin, (req, res) => app.model.testimony.delete(req.body._id, error => res.send({ error })));


    // Home -----------------------------------------------------------------------------------------------------------------------------------------
    app.get('/home/testimony/:_id', (req, res) =>
        app.model.testimony.get(req.params._id, (error, item) => res.send({ error, item })));
};