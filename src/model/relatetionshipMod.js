module.exports = app => {
    const schema = app.db.Schema({
        keeperId: String,
        studentId: String
    });
    const model = app.db.model('RelatetionshipMod', schema);
};