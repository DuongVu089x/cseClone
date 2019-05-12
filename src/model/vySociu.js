module.exports = app => {
    const schema = app.db.Schema({
        vySociuId: app.db.Schema.Types.ObjectId,
        name: String,
        age: Number
    })

    const model = app.db.model('VySociu', schema);
    app.model.vySociuItem = {

        get: (_id, done) => model.findById(_id, (error, item) => {
            if (error) {
                done(error);
            } else if (item == null) {
                done('Invalid Id!');
            } else {
                done(null, item);
            }
        }),

        create: (data, done) => model.create({
            name: data.name,
            age: data.age
        }, done),

        getAll: (done) => model.find({}).sort({
            name: -1
        }).exec(done),

        delete: (_id, done) => model.findById(_id, (error, item) => {
            if (error) {
                done(error);
            } else if (item == null) {
                done('Invalid Id!');
            } else {
                item.remove(done);
            }
        })

    }

}