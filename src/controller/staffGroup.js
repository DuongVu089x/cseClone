module.exports = app => {
    app.get('/admin/staff-group/all', app.role.isAdmin, (req, res) =>
        app.model.staffGroup.getAll((error, items) => res.send({ error, items })));

    app.get('/admin/staff-group/item/:_id', app.role.isAdmin, (req, res) =>
        app.model.staffGroup.get(req.params._id, (error, item) => res.send({ error, item })));

    app.post('/admin/staff-group', app.role.isAdmin, (req, res) =>
        app.model.staffGroup.create({ title: req.body.title }, (error, staffGroup) => res.send({ error, staffGroup })));

    app.put('/admin/staff-group', app.role.isAdmin, (req, res) =>
        app.model.staffGroup.update(req.body._id, req.body.changes, (error, staffGroup) => res.send({ error, staffGroup })));

    app.delete('/admin/staff-group', app.role.isAdmin, (req, res) => app.model.staffGroup.delete(req.body._id, error => res.send({ error })));


    // Home -----------------------------------------------------------------------------------------------------------------------------------------
    app.get('/home/staff-group/:_id', (req, res) =>
        app.model.staffGroup.get(req.params._id, (error, item) => res.send({ error, item })));
};