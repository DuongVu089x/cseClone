module.exports = app => {
    const schema = app.db.Schema({
        image: String,
        firstname: String,
        lastname: String,
        academicTitle: String, // Học hàm: PGS. GS.
        academicDistinction: String, // Học vị: TS. ThS.
        jobPosition: String, // Vị trí việc làm
        divisionId: [app.db.Schema.Types.ObjectId],
        facebook: { type: String, trim: true },
        website: String,
        phoneNumber: String,
        email: { type: String, trim: true },
        active: { type: Boolean, default: false },
    });
    const model = app.db.model('Staff', schema);

    app.model.staff = {
        create: (data, done) => model.create(data, done),

        getAll: done => model.find({}).sort({ lastname: -1, firstname: -1 }).exec(done),

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

        update: (_id, changes, done) => model.findOneAndUpdate({ _id }, { $set: changes }, { new: true }, done),

        delete: (_id, done) => model.findById(_id, (error, item) => {
            if (error) {
                done(error);
            } else if (item == null) {
                done('Id không hợp lệ!');
            } else {
                app.deleteImage(item.image);
                item.remove(done);
            }
        }),
    };
};