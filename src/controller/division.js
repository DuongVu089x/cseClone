module.exports = app => {
    app.get('/admin/division/all', app.role.isAdmin, (req, res) =>
        app.model.division.getAll((error, items) => res.send({ error, items })));

    app.get('/admin/division/item/:_id', app.role.isAdmin, (req, res) =>
        app.model.division.get(req.params._id, (error, item) => res.send({ error, item })));

    app.post('/admin/division', app.role.isAdmin, (req, res) =>
        app.model.division.create(req.body.division, (error, item) => res.send({ error, item })));

    app.put('/admin/division', app.role.isAdmin, (req, res) => {
        // let data = req.body.changes,
        //     changes = {};
        // if (data.name && data.name != '') changes.name = data.name;
        // if (data.type && data.type != '') changes.type = data.type;
        // if (data.active != undefined) changes.active = data.active;
        // if (data.abstract || data.abstract == '') changes.abstract = data.abstract;
        // if (data.content || data.content == '') changes.content = data.content;

        app.model.division.update(req.body._id, req.body.changes, (error, item) => res.send({ error, item }));
    });

    app.put('/admin/division/swap', app.role.isAdmin, (req, res) => {
        const isMoveUp = req.body.isMoveUp.toString() == 'true';
        app.model.division.swapPriority(req.body._id, isMoveUp, error => res.send({ error }));
    });

    app.delete('/admin/division', app.role.isAdmin, (req, res) =>
        app.model.division.delete(req.body._id, error => res.send({ error })));


    // Home -----------------------------------------------------------------------------------------------------------------------------------------
    app.get('/home/division/all', (req, res) =>
        app.model.division.getAll((error, items) => res.send({ error, items })));

    app.get('/division/item/id/:divisionId', (req, res) =>
        app.model.division.get(req.params.divisionId, (error, item) => res.send({ error, item })));
};