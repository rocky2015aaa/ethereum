const router = require('express').Router();
const controller = require('./controller');

router.post('/private-sale-purchase', controller.privateSalePurchase);
router.post('/add-private-sale-list', controller.addToPrivateWhiteList);

router.put('/pause-crowdsale', controller.pauseCrowdSale);
router.put('/unpause-crowdsale', controller.unpauseCrowdSale);
router.put('/finalize-crowdsale', controller.finalizeCrowdSale);
router.put('/start-crowdsale-trial', controller.startCrowdSaleTrial);
router.put('/set-salesinfo', controller.setSalesInfo);
router.put('/refund-by-admin', controller.refundByAdmin);

module.exports = router;