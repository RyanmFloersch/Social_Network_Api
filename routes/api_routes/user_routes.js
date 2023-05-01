const router = require('express').Router();
const {
getUsers,
getSingleUser,
createUser,
updateUser,
deleteUser,
addFriend

} = require('../../controllers/userControllers')


// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

router.route('/:userId/friends/:friendId').put(addFriend).delete();


module.exports = router;