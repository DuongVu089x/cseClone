module.exports = app => {
    const schema = app.db.Schema({
        editor: app.db.Schema.Types.ObjectId,
        type: {
            type: String,
            enum: ['news', 'event', 'job']
        },
        data: Object,
        action: {
            type: String,
            enum: ['create', 'update']
        },
    });
    const model = app.db.model('Draft', schema);

    app.model.draft = {
        create: (data, done) => model.create(data, done),

        get: (_id, done) => model.findById(_id, done),

        getByObjectId: (id, done) => model.find({action: 'update'}).exec((err, data) => {
            if (err) done(err);
            let index = data.findIndex(i => i.data.id == id);
            if (index === -1) done('Invalid Id!');
            else done(null, data[index]);
        }),

        find: (option, done) => model.find(option).exec(done),

        update: (_id, changes, done) => model.findOneAndUpdate({ _id }, { $set: changes }, { new: true }, done),

        delete: (_id, done) => model.findById(_id, (error, item) => {
            if (error) {
                done(error);
            } else if (item == null) {
                done('Invalid Id!');
            } else {
                item.remove(done);
            }
        }),

        getWithRange: (from, to, condition, done) => {
            if (to <= from) done('Invalid range!');
            model.find(condition)
                .sort({action: -1})
                .skip(from)
                .limit(to - from)
                .exec((error, items) => {
                    let list = (error ? [] : items).map(item => app.clone(item.data, { content: '' }));
                    done(error, {drafts: items});
                });
        },

        count: (condition, done) => done ? model.countDocuments(condition, done) : model.countDocuments({}, condition),
    };
};