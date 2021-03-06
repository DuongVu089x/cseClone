module.exports = app => {
    const schema = app.db.Schema({
        carouselId: app.db.Schema.Types.ObjectId,
        priority: Number,
        title: String,
        image: String,
        link: String,
        active: { type: Boolean, default: false },
    });
    const model = app.db.model('CarouselItem', schema);

    app.model.carouselItem = {
        create: (data, done) => {
            model.find({}).sort({ priority: -1 }).limit(1).exec((error, items) => {
                data.priority = error || items == null || items.length === 0 ? 1 : items[0].priority + 1;
                model.create(data, (error, item) => {
                    if (error) {
                        done(error);
                    } else {
                        item.image = '/img/carousel/' + item._id + '.jpg';
                        const srcPath = app.path.join(app.publicPath, '/img/avatar.jpg'),
                            destPath = app.path.join(app.publicPath, item.image);
                        app.fs.copyFile(srcPath, destPath, error => {
                            if (error) {
                                done(error);
                            } else {
                                item.save(done);
                            }
                        });
                    }
                });
            });
        },

        getAll: (done) => model.find({}).sort({ priority: -1 }).exec(done),

        getByCarouselId: (carouselId, done) => model.find({ carouselId }).sort({ priority: -1 }).exec(done),

        getByActiveCarouselId: (carouselId, done) => model.find({ carouselId, active: true }).sort({ priority: -1 }).exec(done),

        get: (_id, done) => model.findById(_id, done),

        update: (_id, changes, done) => {
            model.findOneAndUpdate({ _id }, { $set: changes }, { new: true }, done);
        },

        swapPriority: (_id, isMoveUp, done) => {
            model.findOne({
                _id
            }, (error, item1) => {
                if (error || item1 === null) {
                    done('Invalid carousel item Id!');
                } else {
                    model.find({
                        carouselId: item1.carouselId,
                        priority: isMoveUp ? { $gt: item1.priority } : { $lt: item1.priority }
                    }).sort({
                        priority: isMoveUp ? 1 : -1
                    }).limit(1).exec((error, list) => {
                        if (error) {
                            done(error);
                        } else if (list == null || list.length === 0) {
                            done(null);
                        } else {
                            let item2 = list[0],
                                priority = item1.priority;
                            item1.priority = item2.priority;
                            item2.priority = priority;
                            item1.save(error1 => item2.save(error2 => done(error1 ? error1 : error2, item1, item2)));
                        }
                    });
                }
            });
        },

        delete: (_id, done) => {
            model.findById(_id, (error, item) => {
                if (error) {
                    done(error);
                } else if (item == null) {
                    done('Id không hợp lệ!');
                } else {
                    app.deleteImage(item.image);
                    item.remove(error => done(error, item));
                }
            });
        },

        deleteByCarouselId: (carouselId, done) => model.deleteMany({ carouselId }, done),

        count: (condition, done) => done ? model.countDocuments(condition, done) : model.countDocuments({}, condition),
    };
};