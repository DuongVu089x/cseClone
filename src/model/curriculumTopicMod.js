module.exports = app => {
    const schema = app.db.Schema({
        curriculumId: String,
        topicId: String,
        create_date: Date
    });
    const model = app.db.model('CurriculumTopicMod', schema);
};