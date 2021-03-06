module.exports = app => {

    const schema = app.db.Schema({
        title: String,
        content: String,
        active: { type: Boolean, default: false }
    });
    const model = app.db.model('Content', schema);

    app.model.content = {
        create: (data, done) => model.create(data, done),

        getAll: (done) => model.find({}).sort({ _id: -1 }).exec(done),

        getByActive: (active, done) => model.find({ active }).sort({ _id: -1 }).exec(done),

        get: (_id, done) => model.findById(_id, done),

        update: (_id, changes, done) => model.findOneAndUpdate({ _id }, { $set: changes }, { new: true }, done),

        delete: (_id, done) => {
            model.findById(_id, (error, item) => {
                if (error) {
                    done(error);
                } else if (item == null) {
                    done('Id không hợp lệ!');
                } else {
                    item.remove(error => {
                        if (error) {
                            done(error);
                        } else {
                            app.model.component.clearViewId(_id, done);
                        }
                    });
                }
            })
        },
    };
};