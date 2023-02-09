const uid2 = require('uid2')
const bcrypt = require('bcrypt')
require('dotenv').config({ path: 'local.env' })

const content = require('../../module/content/content')
const { returnError500 } = require('../controllers/util/error')

function generateID(length) {
    let id = uid2(length)
    id = id.replace(/[^a-zA-Z]/g, '')
    return id
}


class contentsController {

    // render ra trang chủ tạo hoặc cập nhật ghichu
    renderHome(req, res, next) {
        res.render('home')
    }

    // tạo tên ghichu
    async createNewURL(req, res, next) {
        try {
            let nameID
            let shareID
            do {
                nameID = generateID(6)
                shareID = generateID(10)
                const existingContent = await content.countDocuments({ nameID, shareID })
                if (existingContent == 0) break
            } while (true)

            return res.status(200).json({
                status: 'Thành công',
                nameID: nameID,
                shareID: shareID
            })
        } catch (error) {
            returnError500(res, 'Lỗi API, vui lòng tải lại trang và thử lại', error)
        }
    }

    // kiểm tra nếu tên nameID không tồn tại trong db thì sẽ lên khung 
    // bao gồm tên ghichu theo nameID và random shareID (không lưu vào db)
    // nếu nameID có trong db thì sẽ lấy dữ liệu đó
    checkContent(req, res, next) {
        try {
            const nameID = req.query.nameID
            content.findOne({ nameID })
                .select('-__v -_id -createdAt')
                .then(async data => {
                    let shareID

                    if (data) {
                        req.dataContent = data
                        return next()
                    }

                    do {
                        shareID = generateID(10)
                        const existingContent = await content.countDocuments({ shareID })
                        if (existingContent == 0) break
                    } while (true)

                    return res.status(200).json({
                        status: 'Đã khởi tạo tên ghi chú hợp lệ',
                        nameID: nameID,
                        shareID: shareID
                    })
                })
                .catch(error => {
                    returnError500(res, 'Lỗi truy vấn, vui lòng tải lại trang và thử lại', error)
                })
        } catch (error) {
            returnError500(res, 'Lỗi API, vui lòng tải lại trang và thử lại', error)
        }
    }

    // lấy dữ liệu từ db
    async getContent(req, res, next) {
        try {
            // const nameID = req.query.nameID
            let isPassword
            const data = req.dataContent
            isPassword = (!data.password) ? false : true

            return res.status(200).json({
                content: data.content,
                nameID: data.nameID,
                shareID: data.shareID,
                token: data.token,
                checkUpdate: true,
                isPassword,
            })

        } catch (error) {
            returnError500(res, 'Lỗi API, vui lòng tải lại trang và thử lại', error)
        }
    }

    // cập nhật dữ liệu
    async updateContent(req, res, next) {
        try {
            const nameID = req.body.nameID
            const dataContent = req.body.content

            content.updateOne({ nameID }, { $set: { content: dataContent } })
                .then(() => {
                    return res.status(200).json({
                        status: 'Cập nhật thành công'
                    })
                })
            .catch(error => {
                returnError500(res, 'Lỗi cập nhật, vui lòng thử lại sau', error)
            })

        } catch (error) {
            returnError500(res, 'Lỗi API, vui lòng tải lại trang và thử lại', error)
        }
    }

    // kiểm tra nếu chưa có ghichu thì sẽ được tạo
    // nếu checkUpdate là true => tiếp tục (bỏ qua để tránh req thừa)
    // nếu chưa tồn tại trong db thì tạo
    // đã tồn tại tiếp tục
    async createURL(req, res, next) {
        try {
            const nameID = req.body.nameID
            const shareID = req.body.shareID
            const checkUpdate = JSON.parse(req.body.checkUpdate)
            let checkContent

            if (checkUpdate == true) return next()

            checkContent = await content.countDocuments({ nameID })

            if (checkContent == 0) {
                const newContent = new content({ nameID, shareID })
                await newContent.save()
                return next()
            }

            return next()
        } catch (error) {
            returnError500(res, 'Lỗi API, vui lòng tải lại trang và thử lại', error)
        }
    }

    //cập nhật mật khẩu
    // băm mật khẩu và trường timeExpire (tự động xóa)
    updatePassword(req, res, next) {
        try {
            const newPassword = req.body.newPassword
            const nameID = req.body.nameID
            const saltRounds = 10

            bcrypt.hash(newPassword, saltRounds, async function (error, hasPass) {
                if (error) {
                    console.log(error)
                    return returnError500(res, 'Lỗi không thể băm mật khẩu', error)
                }

                await content.updateOne({ nameID }, { $set: { password: hasPass } })
                    .then(async data => {
                        let status

                        if (data.modifiedCount > 0) {
                            status = 'Cập nhật mật khẩu thành công'
                            await content.updateOne({ nameID }, { $unset: { timeExpire: 1 } })
                        } else {
                            status = 'Cập nhật mật khẩu thất bại'
                        }

                        return res.status(200).json({ status })
                    })

            })

        } catch (error) {
            returnError500(res, 'Lỗi API, vui lòng tải lại trang và thử lại', error)
        }
    }

    // đổi tên ghichu
    async changeURL(req, res) {
        try {
            const newNameID = req.body.newNameID
            const nameID = req.body.nameID
            const regex = /^[a-zA-Z0-9]+$/

            if (!(regex.test(newNameID))) {
                return res.status(400).json({
                    status: 'Đặt tên không đúng cú pháp'
                })
            }

            const checkNameID = await content.countDocuments({ nameID: newNameID })
            if (checkNameID === 0) {
                content.updateOne({ nameID }, { $set: { nameID: newNameID } })
                    .then(data => {
                        let status
                        if (data.modifiedCount > 0) {
                            status = 'Thay đổi thành công'
                        } else {
                            status = 'Thay đổi thất bại'
                        }
                        return res.status(200).json({ status, newNameID })
                    })
                    .catch(error => {
                        returnError500(res, 'Lỗi truy vấn', error)
                    })
            } else {
                return res.status(400).json({
                    status: 'Tên này đã được sử dụng'
                })
            }


        } catch (error) {
            returnError500(res, 'Lỗi API, vui lòng tải lại trang và thử lại', error)
        }
    }

    // số lượng bảng ghi đang sử dụng
    async usingContent(req, res, next) {
        try {
            let countContent = await content.countDocuments()
            const fake = 1239000

            countContent = (countContent + fake).toLocaleString() // bịp thêm dữ liệu
            return res.status(200).json({ count: countContent })
        } catch (error) {
            console.error(error)
            returnError500(res, 'Lỗi', error)
        }
    }

    // custom api || fake data
    // async xoa(req, res, next) {
    //     try {
    //         // const deletedContents = await content.deleteMany({})
    //         // console.log(deletedContents)
    //         // const newContent = new content({ nameID: 'a', shareID:'a' })
    //         // await newContent.save()
    //         // .then(data=>{
    //         //     res.json(data)
    //         // })

    //         // const nameID = req.body.nameID
    //         // content.findOne({ nameID })
    //         //     .then(data => {
    //         //         if (data) {
    //         //             let check = Boolean
    //         //             if (data.password) {
    //         //                 check = true
    //         //             } else {
    //         //                 check = false
    //         //             }
    //         //             return res.json(check)
    //         //         }else{
    //         //             return res.json('khoong co ghichu')
    //         //         }
    //         //     })

    //     } catch (error) {
    //         console.error(error)
    //     }
    // }
}

module.exports = new contentsController

