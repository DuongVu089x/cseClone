module.exports = app => {
    const schema = app.db.Schema({
        topicId: String,
        type: String,
        content: String,
        audio: String,
        userId: String
    });
    const model = app.db.model('VocabularyMod', schema);
};