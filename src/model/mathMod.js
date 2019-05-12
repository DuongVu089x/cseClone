module.exports = app => {
  const schema = app.db.Schema({
    exerciseId: String,
    userId: { type: app.db.Schema.Types.ObjectId, ref: "UserMod" },
    create_date: Date,
    scores: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0]
    }
  });
  const model = app.db.model("MathMod", schema);
};
