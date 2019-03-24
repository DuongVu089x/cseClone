module.exports = app => {
    const schema = app.db.Schema({
        parentId: app.db.Schema.Types.ObjectId,
        componentId: app.db.Schema.Types.ObjectId,
        priority: Number,
        title: String,
        link: String,
        active: { type: Boolean, default: false }
    });
    const model = app.db.model('Menu', schema);

    app.model.menu = {
        create: (data, done) => {
            model.find({}).sort({ priority: -1 }).limit(1).exec((error, items) => {
                data.priority = error || items == null || items.length === 0 ? 1 : items[0].priority + 1;
                model.create(data, done);
            });
        },

        getAll: (condition, done) => {
            condition.parentId = { $eq: null };
            model.find(condition).sort({ priority: -1 }).exec((error, menus) => {
                if (error || menus == null) {
                    done('Lấy menu bị lỗi!');
                } else {
                    const items = [],
                        getSubmenu = index => {
                            if (index < menus.length) {
                                const item = app.clone(menus[index]);
                                condition.parentId = item._id;
                                model.find(condition).sort({ priority: -1 }).exec((error, submenus) => {
                                    if (submenus) {
                                        item.submenus = submenus;
                                    }
                                    items.push(item);
                                    getSubmenu(index + 1);
                                });
                            } else {
                                done(error, items);
                            }
                        };
                    getSubmenu(0);
                }
            });
        },

        get: (_id, done) => model.findById(_id, done),

        getByLink: (link, done) => model.findOne({ link }, done),

        update: (_id, changes, done) => model.findOneAndUpdate({ _id }, { $set: changes }, { new: true }, done),

        swapPriority: (_id, isMoveUp, done) => {
            model.findById(_id, (error, item1) => {
                if (error || item1 === null) {
                    done('Invalid category Id!');
                } else {
                    const conditions = {
                        parentId: item1.parentId ? item1.parentId : { $eq: null },
                        priority: isMoveUp ? { $gt: item1.priority } : { $lt: item1.priority }
                    };

                    model.find(conditions).sort({ priority: isMoveUp ? 1 : -1 }).limit(1).exec((error, list) => {
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
            });
        },

        delete: (_id, done) => {
            model.findById(_id, (error, item) => {
                if (error || item == null) {
                    done('Lỗi xãy ra khi xóa menu!');
                } else {
                    item.remove(error => {
                        if (error) {
                            done('Lỗi xãy ra khi xóa menu!');
                        } else {
                            model.find({ parentId: _id }, (error, items) => {
                                if (error) {
                                    done('Lỗi xãy ra khi xóa menu!');
                                } else {
                                    const deleteChild = index => {
                                        if (index < items.length) {
                                            app.model.menu.delete(_id, error => deleteChild(index + 1));
                                        } else {
                                            done(null);
                                        }
                                    };
                                    deleteChild(0);
                                }
                            });
                        }
                    });
                }
            });
        },
    };
};