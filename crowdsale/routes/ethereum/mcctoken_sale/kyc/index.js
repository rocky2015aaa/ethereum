const router = require('express').Router();
const controller = require('./controller');

router.put('/add-to-whitelist', controller.addToWhitelist);
router.put('/add-many-to-whitelist', controller.addManyToWhitelist);
router.put('/remove-from-whitelist', controller.removeFromWhitelist);

router.get('/if-in-whitelist', controller.checkIfInWhitelist);

module.exports = router;