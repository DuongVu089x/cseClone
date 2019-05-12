module.exports = app => {
    const schema = app.db.Schema({
        priority: Number,
        name: String,
        type: { type: String, enum: ['department', 'lab'] }, // bộ môn, phòng thí nghiệm 
        active: { type: Boolean, default: false },
        image: String,
        abstract: String,
        content: String,
    });
    const model = app.db.model('Division', schema);

    app.model.division = {
        create: (data, done) => model.find({}).sort({ priority: -1 }).limit(1).exec((error, items) => {
            data.priority = error || items == null || items.length === 0 ? 1 : items[0].priority + 1;
            model.create(data, done);
        }),

        getAll: done => model.find({}).sort({ priority: -1 }).exec((error, items) => {
            if (error) {
                done(error);
            } else if (items == null) {
                done('Invalid Id!');
            } else {
                done(null, items.map(item => app.clone(item, { content: '' })));
            }
        }),

        get: (_id, done) => model.findById(_id, (error, item) => {
            if (error) {
                done(error);
            } else if (item == null) {
                done('Invalid Id!');
            } else {
                done(null, item);
            }
        }),

        update: (_id, changes, done) => model.findOneAndUpdate({ _id }, { $set: changes }, { new: true }, done),

        swapPriority: (_id, isMoveUp, done) => model.findById(_id, (error, item1) => {
            if (error || item1 === null) {
                done('Invalid Id!');
            } else {
                model.find({ priority: isMoveUp ? { $gt: item1.priority } : { $lt: item1.priority } })
                    .sort({ priority: isMoveUp ? 1 : -1 }).limit(1).exec((error, list) => {
                        if (error) {
                            done(error);
                        } else if (list == null || list.length === 0) {
                            done(null);
                        } else {
                            let item2 = list[0],
                                priority = item1.priority;
                            item1.priority = item2.priority;
                            item2.priority = priority;
                            item1.save(error1 => item2.save(error2 => done(error1 ? error1 : error2)));
                        }
                    });
            }
        }),

        delete: (_id, done) => model.findById(_id, (error, item) => {
            if (error) {
                done(error);
            } else if (item == null) {
                done('Invalid Id!');
            } else {
                app.deleteImage(item.image);
                item.remove(done);
            }
        }),
    };
};