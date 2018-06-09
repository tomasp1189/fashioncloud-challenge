const logger = require('../../logger');
const randomString = require('randomstring');
const moment = require('moment');

function Cache(model, ttl, sizeLimit) {
	this.cache = model;
	this.ttl = ttl;
	this.sizeLimit = sizeLimit || 2;
	this.currentSize = 0;
	this.latestHit = '';
}

Cache.prototype.find = async function(key) {
	try {
		let keyValue = await this.cache.findOne({ key: key });
		if (!keyValue) {
			logger.info(`key ${key}: Cache miss`);
			this.latestHit = 'miss';
			keyValue = await this.create(key, randomString.generate());
		} else {
			logger.info(`key ${key}: Cache hit`);
			this.latestHit = 'hit';
			let value = keyValue.value;
			if (kvpHasExpired.apply(this, keyValue.updateAt))
				value = randomString.generate();
			await this.cache.findOneAndUpdate(
				{ key: key },
				{ $set: { value: value } }
			);
		}

		return keyValue;
	} catch (error) {
		logger.error(error);
		throw error;
	}
};

Cache.prototype.create = async function(key, value) {
	try {
		// if size limit has not been reached we can create a new key value pair in
		// the cache

		logger.debug('Cache.prototype.create');
		if (this.currentSize < this.sizeLimit) {
			logger.debug('Creating kvp');
			let kvp = await this.cache.create({
				key,
				value: value || randomString.generate()
			});
			this.currentSize++;
			return kvp;
		} else {
			// if the size limit has been reached the key value pair that has the oldest
			// lastUpdate timestamp will be updated
			logger.debug('update oldest kvp');
			return await updateOldest.apply(this, [key, value]);
		}
	} catch (error) {
		logger.error(error);
		throw error;
	}
};

function kvpHasExpired(lastUpdate) {
	// check if time since last update/check is greater than ttl.
	return moment().diff(moment(lastUpdate)) > this.ttl;
}

async function updateOldest(key, value) {
	try {
		let sortedKvp = await this.cache.findOne({}, {}, { sort: { 'updatedAt' : -1 } });
		let id = sortedKvp[0] && sortedKvp[0].id;
		return await this.cache.findByIdAndUpdate(id, {
			key,
			value: value || randomString.generate()
		});
	} catch (error) {
		logger.error(error);
		throw error;
	}
}

// the objective was to be able to test with mocked schema
module.exports = function(model, ttl, sizeLimit) {
	return new Cache(model, ttl, sizeLimit);
};
