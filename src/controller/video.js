module.exports = app => {
    app.get('/admin/video/all', app.role.isAdmin, (req, res) =>
        app.model.video.getAll((error, items) => res.send({ error, items })));

    app.get('/admin/video/page/:pageNumber/:pageSize', app.role.isAdmin, (req, res) => {
        const pageNumber = parseInt(req.params.pageNumber),
            pageSize = parseInt(req.params.pageSize);
        app.model.video.getPage(pageNumber, pageSize, {}, (error, page) => res.send({ error, page }));
    });

    app.post('/admin/video', app.role.isAdmin, (req, res) => app.model.video.create(req.body.data, (error, video) => {
        if (video && req.session.videoImage) {
            app.adminUploadImage('video', app.model.video.get, video._id, req.session.videoImage, req, res);
        } else {
            res.send({ error, video });
        }
    }));

    app.put('/admin/video', app.role.isAdmin, (req, res) => {
        let data = req.body.changes,
            changes = {};
        if (data.title && data.title != '') changes.title = data.title;
        if (data.link && data.link != '') changes.link = data.link;
        if (data.image && data.image != '') changes.image = data.image;

        app.model.video.update(req.body._id, changes, (error, video) => res.send({ error, video }));
    });

    app.delete('/admin/video', app.role.isAdmin, (req, res) => app.model.video.delete(req.body._id, error => res.send({ error })));


    // Home -----------------------------------------------------------------------------------------------------------------------------------------
    app.get('/home/video/:_id', (req, res) => app.model.video.get(req.params._id, (error, item) => res.send({ error, item })));
};