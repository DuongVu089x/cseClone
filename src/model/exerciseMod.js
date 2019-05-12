module.exports = app => {
    const schema = app.db.Schema({
        topicId: String,
        name: String,
        type: String,
        userId: String
    });
    const model = app.db.model('ExerciseMod', schema);
};