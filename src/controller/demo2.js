module.exports = app => {
    app.get("/admin/demo2/all", app.role.isAdmin, (req, res) => {
        // app.model.vySociuItem.create((error) => {
        //     console.log(error);
        // })

        console.log(app.role)

        app.model.demo2.getAll((error, items) => {
            res.send({
                error,
                items
            });
        });
    });
    app.post("/admin/demo2", app.role.isAdmin, (req, res) => {
        console.log(req.body)
        app.model.demo2.create({
                name: req.body.data.name,
                age: req.body.data.age
            },
            (error, item) =>
            res.send({
                error,
                item
            })
        )
    });


};