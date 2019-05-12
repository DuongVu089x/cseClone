module.exports = app => {
  app.post("/user/register", (req, res) =>
    app.registerUserMod(req, res, "user")
  );
  app.post("/user/login", app.loginUserMod);
  app.post("/user/logout", app.logoutUserMod);

  app.post(
    "/user/get-math",
    app.isLoginedUser,
    (req, res) => {
      app.model.userMod.getMathOfUser(req.session.user.id, (error, data) => {
        console.log(error);
        console.log(data);
      });
    }
    // app.model.user.get(req.body.userId, (error, user) => {
    //   if (error || user == null) {
    //     res.send({
    //       error: "Mã số người dùng không hợp lệ!"
    //     });
    //   } else {
    //     if (user.token === req.body.token) {
    //       user.password = app.model.user.hashPassword(req.body.password);
    //       user.save(error =>
    //         res.send({
    //           error: error ? "Doi mat khau bi loi!" : null
    //         })
    //       );
    //     } else {
    //       res.send({
    //         error: "Đường link không hợp lệ!"
    //       });
    //     }
    //   }
    // })
  );
};
