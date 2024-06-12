const express = require('express');
const router = express.Router();
const cronJobController = require('../controllers/cronJobController');
const auth = require('../middlewares/auth');

router.post('/', auth, cronJobController.createCronJob);
router.get('/', auth, cronJobController.getCronJobs);
router.put('/:id', auth, cronJobController.updateCronJob);
router.delete('/:id', auth, cronJobController.deleteCronJob);

module.exports = router;
