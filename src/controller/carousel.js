module.exports = app => {
    app.get('/admin/carousel/page/:pageNumber/:pageSize', app.role.isAdmin, (req, res) => {
        const pageNumber = parseInt(req.params.pageNumber),
            pageSize = parseInt(req.params.pageSize);
        app.model.carousel.getPage(pageNumber, pageSize, {}, (error, page) => {
            const respone = {};
            if (error || page == null) {
                respone.error = 'Danh sách tập ảnh không sẵn sàng!';
            } else {
                let list = page.list.map(item => app.clone(item, { content: null }));
                respone.page = app.clone(page, { list });
            }
            res.send(respone);
        });
    });

    app.get('/admin/carousel/all', app.role.isAdmin, (req, res) => app.model.carousel.getAll((error, items) => res.send({ error, items })));

    app.get('/admin/carousel/:_id', app.role.isAdmin, (req, res) => app.model.carousel.get(req.params._id, (error, carousel) => {
        if (error || carousel == null) {
            res.send({ error: 'Lỗi khi lấy danh sách hình ảnh!' });
        } else {
            app.model.carouselItem.getByCarouselId(carousel._id, (error, items) => {
                if (error || items == null) {
                    res.send({ error: 'Lỗi khi lấy danh sách hình ảnh!' });
                } else {
                    res.send({ item: app.clone(carousel, { items }) });
                }
            });
        }
    }));

    app.post('/admin/carousel', app.role.isAdmin, (req, res) =>
        app.model.carousel.create(req.body.data, (error, carousel) => res.send({ error, carousel })));

    app.put('/admin/carousel', app.role.isAdmin, (req, res) =>
        app.model.carousel.update(req.body._id, req.body.changes, (error, item) => res.send({ error, item })));

    app.delete('/admin/carousel', app.role.isAdmin, (req, res) =>
        app.model.carousel.delete(req.body.id, error => res.send({ error })));



    app.post('/admin/carousel/item', app.role.isAdmin, (req, res) => app.model.carouselItem.create(req.body.data, (error, item) => {
        if (item && req.session.carouselItemImage) {
            app.adminUploadImage('carouselItem', app.model.carouselItem.get, item._id, req.session.carouselItemImage, req, res);
        } else {
            res.send({ error, item });
        }
    }));

    app.put('/admin/carousel/item', app.role.isAdmin, (req, res) =>
        app.model.carouselItem.update(req.body._id, req.body.changes, (error, item) => res.send({ error, item })));

    app.put('/admin/carousel/item/swap', app.role.isAdmin, (req, res) => {
        const isMoveUp = req.body.isMoveUp.toString() == 'true';
        app.model.carouselItem.swapPriority(req.body._id, isMoveUp, (error, item1, item2) => res.send({ error, item1, item2 }));
    });

    app.delete('/admin/carousel/item', app.role.isAdmin, (req, res) =>
        app.model.carouselItem.delete(req.body._id, (error, item) => res.send({ error, carouselId: item.carouselId })));


    // Home -----------------------------------------------------------------------------------------------------------------------------------------
    app.get('/home/carousel/:_id', (req, res) => app.model.carousel.get(req.params._id, (error, carousel) => {
        if (error || carousel == null) {
            res.send({ error: 'Error when got images!' });
        } else {
            app.model.carouselItem.getByCarouselId(carousel._id, (error, items) => {
                if (error || items == null) {
                    res.send({ error: 'Error when got images!' });
                } else {
                    res.send({ item: app.clone(carousel, { items }) });
                }
            });
        }
    }));
};