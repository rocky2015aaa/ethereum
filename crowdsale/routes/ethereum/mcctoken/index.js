const router = require('express').Router();
const controller = require('./controller');

router.get('/amount', controller.mccTokenAmount);
router.get('/wallet', controller.wallet);
router.get('/owner', controller.owner);
router.get('/manager', controller.manager);
router.get('/canissue', controller.canissue);
router.get('/islimited', controller.islimited);
router.get('/islimitedWallet', controller.isLimitedWallet);

router.post('/disablelimit', controller.disablelimit);
router.post('/addLimitedWallet', controller.addLimitedWallet);
router.post('/removeLimitedWallet', controller.removeLimitedWallet);

module.exports = router;