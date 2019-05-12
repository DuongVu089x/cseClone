module.exports = app => {
    app.get('/admin/staff/page/:pageNumber/:pageSize', app.role.isAdmin, (req, res) => {
        const pageNumber = parseInt(req.params.pageNumber),
            pageSize = parseInt(req.params.pageSize);
        app.model.staff.getPage(pageNumber, pageSize, {}, (error, page) => res.send({ error, page }));
    });

    app.get('/admin/staff/all', app.role.isAdmin, (req, res) => app.model.staff.getAll((error, items) => res.send({ error, items })));

    app.get('/admin/staff/:_id', app.role.isAdmin, (req, res) => app.model.staff.get(req.params._id, (error, item) => res.send({ error, item })));

    app.post('/admin/staff', app.role.isAdmin, (req, res) => app.model.staff.create(req.body.data, (error, item) => {
        if (item && req.session.staffImage) {
            app.adminUploadImage('staff', app.model.staff.get, item._id, req.session.staffImage, req, res);
        } else {
            res.send({ error, item });
        }
    }));

    app.put('/admin/staff', app.role.isAdmin, (req, res) => {
        const data = req.body.changes;
        if (data.divisionId == '') data.divisionId = [];
        app.model.staff.update(req.body._id, data, (error, item) => res.send({ error, item }));
    });

    app.delete('/admin/staff', app.role.isAdmin, (req, res) => app.model.staff.delete(req.body._id, error => res.send({ error })));
};