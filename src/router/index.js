const content = require('./content')
const share = require('./share')

function router(app) {
    app.use('/share', share)
    app.use('/', content)
}

module.exports = router