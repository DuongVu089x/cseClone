module.exports = app => {
    const schema = app.db.Schema({
        name: String
    });
    const model = app.db.model('RoleMod', schema);

    app.model.roleMod = {
        create: (data, done) => model.create({
            name: data.name
        }, done)
    }
};