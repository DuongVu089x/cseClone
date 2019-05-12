module.exports = (app) => {
    const schema = app.db.Schema({
        title: String,
        abstract: String,
        keywords: String,
        wordFilename: String,
        pdfFilename: String,

        date: { type: Date, default: Date.now },
        selected: { type: Boolean, default: false },
        lock: { type: Boolean, default: false },

        conferenceId: app.db.Schema.ObjectId,
        userId: { type: app.db.Schema.ObjectId, ref: 'User' }, //app.db.Schema.ObjectId, // create paper
        authors: [app.db.Schema.ObjectId], // [userId]
    });

    const model = app.db.model('Paper', schema);
    app.model.paper = {
        create: (data, done) => {
            data.date = new Date();
            data.lock = false;
            model.create(data, (error, paper) => {
                if (done) done(error, paper);
            });
        },

        getPage: (pageNumber, pageSize, condition, done) => model.countDocuments(condition, (error, totalItem) => {
            if (error) {
                done(error);
            } else {
                let result = { totalItem, pageSize, pageTotal: Math.ceil(totalItem / pageSize) };
                result.pageNumber = pageNumber === -1 ? result.pageTotal : Math.min(pageNumber, result.pageTotal);

                const skipNumber = (result.pageNumber > 0 ? result.pageNumber - 1 : 0) * result.pageSize;
                model.find(condition).sort({ _id: 1 }).skip(skipNumber).limit(result.pageSize).populate('userId').exec((error, list) => {
                    result.list = list;
                    done(error, result);
                });
            }
        }),

        get: (_id, done) => model.findById(_id, done),

        getByUserId: (userId, done) => model.find({ userId }).sort({ _id: -1 }).exec(done),
        getByConferenceId: (conferenceId, done) => model.find({ conferenceId }).sort({ _id: -1 }).exec(done),
        getByConferenceIdUserId: (conferenceId, userId, done) => model.find({ conferenceId, userId }).sort({ _id: -1 }).exec(done),

        getByUserIdPaperId: (userId, _id, done) => model.findOne({ userId, _id }, done),

        getByAcceptedAbstract: done => model.find({ acceptedAbstract: true }).sort({ _id: -1 }).exec(done),

        toggleLock: (_id, done) => model.findById(_id, (error, paper) => {
            if (error) {
                done(error);
            } else if (paper == null) {
                done('Paper is not available!');
            } else {
                paper.lock = !paper.lock;
                paper.save((error) => {
                    done(error, paper);
                });
            }
        }),
        lockAll: (value, done) => model.update({}, { $set: { lock: value } }, { multi: true }, done),

        toggleAcceptedAbstract: (_id, done) => model.findById(_id, (error, paper) => {
            if (error) {
                done(error);
            } else if (paper == null) {
                done('Paper is not available!');
            } else {
                paper.acceptedAbstract = (paper.acceptedAbstract === undefined || paper.acceptedAbstract === false);
                paper.save((error) => {
                    done(error, paper);
                });
            }
        }),
        acceptAbstractAll: (value, done) => {
            model.update({}, { $set: { acceptedAbstract: value } }, { multi: true }, done);
        },

        countUserPaper: (conferenceId, userId, done) =>
            model.countDocuments({ conferenceId, userId }, (error, numberOfPapers) => done(error == null || numberOfPapers ? numberOfPapers : 0)),

        statistic: (conferenceId, done) =>
            model.cocountDocumentsunt({ conferenceId }, (error, numberOfAbstracts) => {
                model.countDocuments({ conferenceId, $and: [{ wordFilename: { $ne: null } }, { wordFilename: { $ne: '' } }] }, (error, numberOfWords) => {
                    model.countDocuments({ conferenceId, $and: [{ pdfFilename: { $ne: null } }, { pdfFilename: { $ne: '' } }] }, (error, numberOfPdfs) => {
                        done(numberOfAbstracts, numberOfWords, numberOfPdfs);
                    });
                });
            }),

        update: (_id, changes, done) => model.findOneAndUpdate({ _id }, { $set: changes }, { new: true }, done),

        delete: (_id, done) => model.findByIdAndRemove(_id, done),

        // deleteById: (userId, _id, done) => model.findOne({ userId, _id }, (error, paper) => {
        //     if (error || paper == null) {
        //         done('Delete paper has some errors!');
        //     } else {
        //         app.model.author.deleteByPaperId(paper._id, (error) => {
        //             if (error) {
        //                 done('Delete paper has some errors!');
        //             } else {
        //                 model.remove({ _id }, done);
        //             }
        //         });
        //     }
        // }),

        // deleteByAdmin: (_id, done) => model.findById(_id, (error, paper) => {
        //     if (error || paper == null) {
        //         done('Delete paper has some errors!');
        //     } else {
        //         app.model.author.deleteByPaperId(paper._id, (error) => {
        //             if (error) {
        //                 done('Delete paper has some errors!');
        //             } else {
        //                 model.remove({ _id }, done);
        //             }
        //         });
        //     }
        // })
    };
};