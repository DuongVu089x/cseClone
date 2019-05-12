module.exports = app => {
    app.get('/admin/slogan/all', app.role.isAdmin, (req, res) => app.model.slogan.getAll((error, items) => res.send({ error, items })));

    app.get('/admin/slogan/item/:sloganId', app.role.isAdmin, (req, res) =>
        app.model.slogan.get(req.params.sloganId, (error, item) => res.send({ error, item })));

    app.post('/admin/slogan', app.role.isAdmin, (req, res) =>
        app.model.slogan.create({ title: req.body.title }, (error, item) => res.send({ error, item })));

    app.put('/admin/slogan', app.role.isAdmin, (req, res) =>
        app.model.slogan.update(req.body._id, req.body.changes, (error, item) => res.send({ error, item })));

    app.delete('/admin/slogan', app.role.isAdmin, (req, res) => app.model.slogan.delete(req.body._id, error => res.send({ error })));


    // Home -----------------------------------------------------------------------------------------------------------------------------------------
    app.get('/home/slogan/:_id', (req, res) => app.model.slogan.get(req.params._id, (error, item) => res.send({ error, item })));
};