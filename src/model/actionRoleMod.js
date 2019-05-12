module.exports = app => {
    const schema = app.db.Schema({
        roleId: String,
        actionId: String
    });
    const model = app.db.model('ActionRoleMod', schema);
};