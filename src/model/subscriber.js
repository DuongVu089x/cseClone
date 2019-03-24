module.exports = app => {
    const schema = app.db.Schema({
        email: String,
        createdDate: Date,
    });
    const model = app.db.model('Subscriber', schema);

    app.model.subscriber = {
        create: (data, done) => app.model.subscriber.getByEmail(data.email, (error, subscriber) => {
            if (error) {
                if (done) done('Quá trình đăng ký gặp lỗi!');
            } else if (subscriber) {
                if (done) done('Email bạn đã được đăng ký!');
            } else {
                data.createdDate = new Date();
                model.create(data, done)
            }
        }),

        getAll: done => model.find({}).sort({ _id: -1 }).exec(done),

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

        get: (_id, done) => model.findById(_id, done),

        getByEmail: (email, done) => model.findOne({ email }, done),

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
    };
};