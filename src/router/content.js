const router = require('express').Router()

const content = require('../app/controllers/contentsControllers')
const auth = require('../app/controllers/authControllers')

router.get('/api/content/createNewURL', content.createNewURL)
router.get('/api/content/getContent', content.checkContent, auth.loginPassword, content.getContent)
router.post('/api/content/update', content.createURL, auth.authPassword, content.updateContent)
router.put('/api/content/changeURL', auth.authPassword, content.changeURL)
router.put('/api/content/changePassword', auth.authPassword, content.updatePassword)

router.get('/api/usingContent', content.usingContent)

// router.post('/api/xoa', content.xoa)

router.get('/', content.renderHome)
router.get('/:id', content.renderHome)

router.use('/:id/*', (req, res, next) => {
    res.render('error/error403' , {layout :false})
})

module.exports = router