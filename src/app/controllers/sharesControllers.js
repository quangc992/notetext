const content = require("../../module/content/content")
const { returnError500 } = require('../controllers/util/error')

class shareController {
    // render 
    renderShare(req, res, next) {
        res.render('share')
    }

    async renderContentShare(req, res, next) {
        try {
            const shareID = req.query.shareID
            let valid
            let status
            let dataContent = null
            const contentShare = await content.findOne({ shareID }).select('content')

            if (!contentShare) {
                valid = false
                status = 'Không tồn tại dữ liệu'
            } else {
                valid = true
                status = 'Tải dữ liệu thành công'
                dataContent = contentShare.content
            }

            return res.status(200).json({
                status,
                valid,
                content: dataContent,
            })
        } catch (error) {
            returnError500(res, 'Lỗi truy vấn, vui lòng tải lại trang và thử lại', error)
        }
    }

}

module.exports = new shareController
