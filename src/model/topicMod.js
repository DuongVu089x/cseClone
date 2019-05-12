module.exports = app => {
    const schema = app.db.Schema({
        nameTopic: String,
        userId: String
    });
    const model = app.db.model('TopicMod', schema);
};