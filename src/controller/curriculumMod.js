module.exports = app => {
  app.post(
    "/curriculum/get-all",
    app.acceptTeacherAndParentAdAdmin,
    (req, res) => {}
  );
};
