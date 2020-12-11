const router = require('express').Router();
const controller = require('./controller');

// temp APIs are for only POC or test. On production, this module will be removed
router.get('/load-investor-list', controller.loadInverstorList);
router.get('/load-special-investor-list', controller.loadSpecialInverstorList);
router.get('/user', controller.getUserType);
router.get('/if-smart-contract-deployed', controller.getIfSmartContractDeployed);

router.put('/update-user-info', controller.updateUserInfo);
router.post('/add-batch-queue', controller.addBatchQueue);
router.post('/add-user', controller.addUser);
router.post('/add-user-role', controller.addUserRole);
router.post('/assign-bonus-token', controller.assignBonusToken);

router.put('/update-user-iswhitelisted', controller.updateUserIsWhiteListed);

module.exports = router;