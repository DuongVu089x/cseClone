module.exports = app => {
    const schema = app.db.Schema({
        title: String,
        staff: [{
            staffId: app.db.Schema.Types.ObjectId,
            content: String,
        }]
    });
    const model = app.db.model('StaffGroup', schema);

    app.model.staffGroup = {
        create: (data, done) => model.create(data, done),

        getAll: done => model.find({}).sort({ _id: -1 }).exec(done),

        get: (_id, done) => {
            model.findById(_id, (error, group) => {
                if (error) {
                    done(error);
                } else if (group == null) {
                    done('Invalid Id!');
                } else {
                    const getStaff = index => {
                        if (index < group.staff.length) {
                            app.model.staff.get(group.staff[index].staffId, (error, staff) => {
                                group.staff[index].info = staff;
                                getStaff(index + 1);
                            });
                        } else {
                            done(null, group);
                        }
                    };

                    group = app.clone(group);
                    if (group.staff == null) group.staff = [];
                    getStaff(0);
                }
            });
        },

        update: (_id, changes, done) => model.findOneAndUpdate({ _id }, { $set: changes }, { new: true }, done),

        delete: (_id, done) => {
            model.findById(_id, (error, item) => {
                if (error) {
                    done(error);
                } else if (item == null) {
                    done('Invalid Id!');
                } else {
                    item.remove(done);
                }
            });
        },
    };
};