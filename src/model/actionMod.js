module.exports = app => {
    const schema = app.db.Schema({
        name: String,
        url: String
    });
    const model = app.db.model('ActionMod', schema);

    app.model.actionMod = {
        verifyUrl: (url, done) => {
            console.log(url);
            model.aggregate([{
                $lookup: {
                    from: 'ActionRoleMod',
                    localField: 'id',
                    foreignField: 'actionId',
                    as: 'demo'
                }
            }], done)
        }
    }
};