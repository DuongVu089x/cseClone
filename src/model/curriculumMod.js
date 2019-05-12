module.exports = app => {
    const schema = app.db.Schema({
        userId: String,
        createDate: Date
    });
    const model = app.db.model('CurriculumMod', schema);

    app.model.curriculumMod = {
        create: (data, done) => model.create({
            userId: data.userId,
            createDate: new Date()
        }, done)
    }

};