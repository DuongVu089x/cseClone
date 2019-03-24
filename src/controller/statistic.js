module.exports = app => {
    app.get('/admin/statistic/all', app.role.isAdmin, (req, res) =>
        app.model.statistic.getAll((error, items) => res.send({ error, items })));

    app.get('/admin/statistic/item/:statisticId', app.role.isAdmin, (req, res) =>
        app.model.statistic.get(req.params.statisticId, (error, item) => res.send({ error, item })));

    app.post('/admin/statistic', app.role.isAdmin, (req, res) =>
        app.model.statistic.create({ title: req.body.title }, (error, item) => res.send({ error, item })));

    app.put('/admin/statistic', app.role.isAdmin, (req, res) =>
        app.model.statistic.update(req.body._id, req.body.changes, (error, item) => res.send({ error, item })));

    app.delete('/admin/statistic', app.role.isAdmin, (req, res) => app.model.statistic.delete(req.body._id, error => res.send({ error })));


    // Home -----------------------------------------------------------------------------------------------------------------------------------------
    app.get('/home/statistic/:_id', (req, res) =>
        app.model.statistic.get(req.params._id, (error, item) => res.send({ error, item })));
};