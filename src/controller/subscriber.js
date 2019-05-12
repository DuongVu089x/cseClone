module.exports = app => {
    app.get('/admin/subscriber/page/:pageNumber/:pageSize', app.role.isAdmin, (req, res) => {
        const pageNumber = parseInt(req.params.pageNumber),
            pageSize = parseInt(req.params.pageSize);
        app.model.subscriber.getPage(pageNumber, pageSize, {}, (error, page) => res.send({ error, page }));
    });

    app.get('/admin/subscriber/all', app.role.isAdmin, (req, res) => app.model.subscriber.getAll((error, items) => res.send({ error, items })));

    app.get('/admin/subscriber/item/:_id', app.role.isAdmin, (req, res) =>
        app.model.subscriber.get(req.params._id, (error, item) => res.send({ error, item })));

    app.post('/admin/subscriber/send', app.role.isAdmin, (req, res) => app.model.subscriber.getAll((error, items) => {
        if (error || items == null) {
            res.send({ error: 'Lỗi khi gửi email đến subscriber!' });
        } else {
            let emails = items.map(item => item.email);
            app.email.sendEmail(emails, [], req.body.mailSubject, req.body.mailText, req.body.mailHtml, null,
                () => res.send({ error: null }),
                error => res.send({ error }));
        }
    }));

    app.put('/admin/subscriber', app.role.isAdmin, (req, res) =>
        app.model.subscriber.update(req.body._id, req.body.changes, (error, item) => res.send({ error, item })));

    app.get('/admin/subscriber/download', app.role.isAdmin, (req, res) => app.model.subscriber.getAll((error, items) => {
        if (error) {
            res.send({ error });
        } else {
            const workbook = app.excel.create(),
                worksheet = workbook.addWorksheet('Subscriber'),
                cells = [{ cell: 'A1', value: '#', bold: true, border: '1234' }, { cell: 'B1', value: 'Email', bold: true, border: '1234' }];
            items.forEach((element, index) => {
                cells.push({ cell: 'A' + (index + 2), border: '1234', number: index + 1 });
                cells.push({ cell: 'B' + (index + 2), border: '1234', value: element.email });
            });

            worksheet.columns = [
                { header: '#', key: 'number', width: 5 },
                { header: 'Email', key: 'email', width: 32 }
            ];
            app.excel.write(worksheet, cells);
            app.excel.attachment(workbook, res, 'Subscriber.xlsx');
        }
    }));

    app.delete('/admin/subscriber', app.role.isAdmin, (req, res) => app.model.subscriber.delete(req.body._id, error => res.send({ error })));


    // Home -----------------------------------------------------------------------------------------------------------------------------------------
    app.post('/home/subscriber', (req, res) =>
        app.model.subscriber.create({ email: req.body.email }, (error, item) => res.send({ error, item })));
};