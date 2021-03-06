module.exports = app => {
    const schema = app.db.Schema({
        name: String,
        email: String,
        subject: String,
        message: String,
        conferenceId: app.db.Schema.Types.ObjectId,
        userId: app.db.Schema.Types.ObjectId,
        read: { type: Boolean, default: false },
        createdDate: { type: Date, default: Date.now },
    });
    const model = app.db.model('Contact', schema);

    app.model.contact = {
        create: (data, done) => model.create(data, done),

        getAll: (done) => model.find({}).sort({ _id: -1 }).exec(done),

        getUnread: (done) => model.find({ read: false }).sort({ _id: -1 }).exec(done),

        getPage: (pageNumber, pageSize, condition, done) => model.countDocuments(condition, (error, totalItem) => {
            if (error) {
                done(error);
            } else {
                let result = {
                    totalItem,
                    pageSize,
                    pageTotal: Math.ceil(totalItem / pageSize)
                };
                result.pageNumber = pageNumber === -1 ? result.pageTotal : Math.min(pageNumber, result.pageTotal);

                const skipNumber = (result.pageNumber > 0 ? result.pageNumber - 1 : 0) * result.pageSize;
                model.find(condition).sort({ _id: 1 }).skip(skipNumber).limit(result.pageSize).exec((error, list) => {
                    result.list = list;
                    done(error, result);
                });
            }
        }),

        getByActive: (active, done) => model.find({ active }).sort({ _id: -1 }).exec(done),

        getByConferenceId: (conferenceId, done) => model.find({ conferenceId }).sort({ _id: -1 }).exec(done),
        getByAuthor: (conferenceId, userId, done) => model.find({ conferenceId, userId }).sort({ _id: -1 }).exec(done),

        get: (_id, done) => model.findById(_id, done),

        read: (_id, done) => model.findOneAndUpdate({ _id }, { $set: { read: true } }, { new: true }, done),

        update: (_id, changes, done) => model.findOneAndUpdate({ _id }, { $set: changes }, { new: true }, done),

        delete: (_id, done) => model.findById(_id, (error, item) => {
            if (error) {
                done(error);
            } else if (item == null) {
                done('Id không hợp lệ!');
            } else {
                item.remove(done);
            }
        }),

        count: (condition, done) => done ? model.countDocuments(condition, done) : model.countDocuments({}, condition),
    };
};