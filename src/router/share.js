const router = require('express').Router()

const share = require('../app/controllers/sharesControllers')

router.get('/api/getContent', share.renderContentShare)

router.get('/:id', share.renderShare)
router.get('/', (req, res) => {
    res.render('error/error403', { layout: false })
})

module.exports = router