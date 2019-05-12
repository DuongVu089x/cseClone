module.exports = app => {
    const schema = app.db.Schema({
        demo2Id: app.db.Schema.Types.ObjectId,
        name: String,
        age: Number
    })

    const model = app.db.model('demo2', schema);
    app.model.demo2 = {



        getAll: (done) => model.find({}).sort({
            name: -1
        }).exec(done),
        create: (data, done) => model.create({
            name: data.name,
            age: data.age
        }, done)


    }

}