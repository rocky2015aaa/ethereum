const router = require('express').Router();
const controller = require('./controller');

router.get('/wallet', controller.wallet);
router.get('/owner', controller.owner);
router.get('/token', controller.token);
router.get('/state', controller.state);

module.exports = router;