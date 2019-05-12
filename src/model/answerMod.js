module.exports = app => {
    const schema = app.db.Schema({
        questionId: String,
        content: String,
        img: String,
        audio: String
    });
    const model = app.db.model('AnswerMod', schema);
};