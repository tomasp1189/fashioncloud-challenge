const keys = require('../../config/keys');
const mongoose = require('mongoose');

require('../../lib/cache/models/cacheSchema');

mongoose.Promise = global.Promise;
mongoose.connect(
	keys.MONGO_URI,
	{ useMongoClient: 'true' }
);

let Cache = mongoose.model('cache');
const cacheService = require('./models/cache')(Cache, 5000, 5);

var router = require('express').Router({ mergeParams: true });
module.exports = router;

router.get('/:key', function(req, res) {
	cacheService
		.find(req.params.key)
		.then(kvp => {
			if (kvp) {
				res.status(200).send({ kvp });
			} else {
				res.status(404);
			}
		})
		.catch(error => {
			logger.error(error);
			res.status(500).send(error);
		});
});
