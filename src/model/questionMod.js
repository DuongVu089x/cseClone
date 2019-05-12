module.exports = app => {
    const schema = app.db.Schema({
        exerciseId: String,
        content: String,
        answer: String,
        type: String
    });
    const model = app.db.model('QuestionMod', schema);
};