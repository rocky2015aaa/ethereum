const router = require('express').Router();
const controller = require('./controller');

router.get('/wallet', controller.wallet);
router.get('/owner', controller.owner);
router.get('/pause', controller.pause);
router.get('/trial', controller.trial);
router.get('/infos', controller.infos);
router.get('/isfinalized', controller.isfinalized);
router.get('/isclosed', controller.isclosed);
router.get('/goal', controller.goal);
router.get('/hardcap', controller.hardcap);
router.get('/fund', controller.fund);
router.get('/available-token-to-sell', controller.availableTokenToSell);
router.get('/ether-amount', controller.etherAmount);
router.get('/private-sale-rate', controller.getPrivateSaleRate);
router.get('/private-sale-minimum', controller.getPrivateSaleMinumum);

// router.post('/kill-contract', controller.killContract);

module.exports = router;