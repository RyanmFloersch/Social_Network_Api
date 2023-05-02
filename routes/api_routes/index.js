const router = require('express').Router();
const thoughtRoutes = require('./thought_routes');
const userRoutes = require('./user_routes');

router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);


module.exports = router;