const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'local.env' })

const content = require('../../module/content/content')
const { bcryptCompare } = require('../controllers/util/bcrypt')
const { returnError500 } = require('../controllers/util/error')


function verifyToken(token) {
    // const publickey = fs.readFileSync(path.join(__dirname, '../config/key/rsa.public'))
    const publickey = process.env.KEYTOKENJWT // sử dụng tạm thời
    const decoded = jwt.verify(token, publickey) //, { algorithms: ['RS256'] }
    return decoded
}


class authController {
    loginPassword(req, res, next) {
        try {
            const password = req.query.password
            const nameID = req.query.nameID
            const token = req.query.token
            content.findOne({ nameID })
                .select('password')
                .then(async data => {
                    if (!data) return res.status(400).json({ status: 'Ghi chú không tồn tại' })
                    if (!data.password) return next()
                    
                    //check nếu token hợp lệ đã login từ trước thì tiếp tục
                    if (token) {
                        const decoded = verifyToken(token)
                        if (decoded.nameID === nameID) {
                            return next()
                        }
                    }

                    if (!password) {
                        return res.status(400).json({
                            status: 'Vui lòng cung cấp mật khẩu',
                            providePassword: true
                        })
                    }
                    const isPass = await bcryptCompare(data.password, password)
                    if (isPass) {
                        // const privatekey = fs.readFileSync(path.join(__dirname, '../config/key/rsa.private'))
                        const privatekey = process.env.KEYTOKENJWT // sử dụng tạm thời
                        const expiresIn = '2d'

                        const payload = {
                            nameID: nameID
                        }

                        const createToken = jwt.sign(payload, privatekey, { expiresIn }) //, algorithm: 'RS256' 

                        req.dataContent = { ...req.dataContent._doc, token: createToken }
                        next()
                    } else {
                        return res.status(500).json({
                            status: 'Mật khẩu không chính xác'
                        })
                    }
                })
        } catch (error) {
            returnError500(res, 'Lỗi API, vui lòng tải lại trang và thử lại', error)
        }
    }

    authPassword(req, res, next) {
        try {
            const nameID = req.body.nameID

            content
                .findOne({ nameID })
                .then((data) => {
                    if (!data) {
                        return res.status(400).json({
                            status: 'Không tồn tại dữ liệu',
                        })
                    }
                    if (!data.password) return next()
                    const decoded = verifyToken(req.body.token)

                    if (decoded.nameID === nameID) {
                        return next()
                    } else {
                        return res.status(400).json({
                            status: 'Vui lòng đăng nhập lại',
                            valid: false,
                        })
                    }
                })
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(400).json({
                    status: 'Vui lòng cung cấp token',
                    valid: false,
                })
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({
                    status: 'Token hết hạn. Vui lòng đăng nhập lại',
                    valid: false,
                })
            } else {
                returnError500(res, 'Lỗi API, vui lòng tải lại trang và thử lại', error)
            }
        }
    }
}

module.exports = new authController

