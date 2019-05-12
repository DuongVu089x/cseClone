module.exports = app => {
  const schema = app.db.Schema({
    role: String,
    name: String,
    age: Number,
    username: String,
    password: String,
    email: String,
    create_date: Date,
    level: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7]
    },
    image: String,
    active: Boolean,
    maths: [{ type: app.db.Schema.Types.ObjectId, ref: "MathMod" }]
  });
  schema.methods.equalPassword = function(password) {
    return app.crypt.compareSync(password, this.password);
  };
  const model = app.db.model("UserMod", schema);
  app.model.userMod = {
    hashPassword: password =>
      app.crypt.hashSync(password, app.crypt.genSaltSync(8), null),

    auth: (email, password, done) => {
      model.findOne(
        {
          email
        },
        (error, user) => {
          console.log(user);
          done(
            error == null &&
              user != null &&
              app.crypt.compareSync(password, user.password)
              ? user
              : null
          );
        }
      );
    },

    getMathOfUser: (userId, done) => {
      model
        .find({
          _id: userId
        })
        .populate("maths")
        .exec(done);
    }
  };
};
