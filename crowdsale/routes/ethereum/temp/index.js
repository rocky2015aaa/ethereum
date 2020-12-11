const router = require('express').Router();
const controller = require('./controller');

// temp APIs are for only POC or test. On production, this module will be removed

router.get('/wallets', controller.wallets);

// ========= Not for UI ===============

router.get('/tansaction-gas-information', controller.checkTransactionGasInformation);

router.put('/tansaction-gas-price', controller.setTransactionGasPrice);
router.put('/tansaction-gas-limit', controller.setTransactionGasLimit);

module.exports = router;