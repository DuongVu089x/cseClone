module.exports = app => {
  app.get(
    "/admin/vySociu/all",
    app.role.isAdmin,
    app.acceptTeacherAndParentAdAdmin,
    (req, res) => {
      // app.model.vySociuItem.create((error) => {
      //     console.log(error);
      // })

      console.log(app.role);
      app.model.userMod.getMathOfUser(req.session.user.id, (error, data) => {
        console.log(error);
        console.log(data);
      });

      app.model.vySociuItem.getAll((error, items) => {
        res.send({
          error,
          items
        });
      });
    }
  );

  app.get("/admin/vySociu/item/:vySociuId", app.role.isAdmin, (req, res) =>
    app.model.vySociuItem.get(req.params.vySociuId, (error, item) =>
      res.send({
        error,
        item
      })
    )
  );

  app.post("/admin/vySociu", app.role.isAdmin, (req, res) => {
    console.log(req.body);
    app.model.vySociuItem.create(
      {
        name: req.body.data.name,
        age: req.body.data.age
      },
      (error, item) =>
        res.send({
          error,
          item
        })
    );
  });

  app.put("/admin/vySociu", app.role.isAdmin, (req, res) =>
    app.model.vySociu.update(req.body._id, req.body.changes, (error, item) =>
      res.send({
        error,
        item
      })
    )
  );

  app.delete("/admin/vySociu", app.role.isAdmin, (req, res) =>
    app.model.vySociuItem.delete(req.body._id, error =>
      res.send({
        error
      })
    )
  );

  // Home -----------------------------------------------------------------------------------------------------------------------------------------
  app.get("/home/vySociu/:_id", (req, res) =>
    app.model.vySociu.get(req.params._id, (error, item) =>
      res.send({
        error,
        item
      })
    )
  );
};
