const router = require('express').Router();

const {} = require('../../controllers/thoughtController');


router.route('/').get().post();

router.route('/:thoughtId').get().delete();

router.route('/:thoughtId/reactions').post().delete();