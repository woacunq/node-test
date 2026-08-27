const systemConfig = require("../../config/system")
const SettingGeneral = require("../../models/settings-general.model")
// [GET] /admin/setting/general
module.exports.general = async (req, res) => {

    const settingGeneral = await SettingGeneral.findOne({})
    // if (!settingGeneral) {
    //     settingGeneral = {};    }
    res.render('admin/pages/settings/general', {
        pageTitle: 'Cài đặt chung',
        settingGeneral
    });
};

// [PATCH] /admin/setting/general
exports.generalPatch = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({})

    await SettingGeneral.updateOne(
        {
            _id: settingGeneral.id
        }, req.body
    )
    // const record = new SettingGeneral(req.body)
    // await record.save()

    req.flash("success", "Cập nhật thành công")
    res.redirect(`${systemConfig.prefixAdmin}/settings/general`);
}
