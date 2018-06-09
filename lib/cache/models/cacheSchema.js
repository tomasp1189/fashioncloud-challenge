const mongoose = require('mongoose');
const { Schema } = mongoose;

const cacheSchema = new Schema(
	{
		key: String,
		value: String,
		ttl: Number
	}
	,{timestamps: true}
);

// bookSchema.static('findByAuthor', function (author) {
//   return this.find({ author: author })
//     .limit(10)
//     .sort('-date')
//     .exec();
// });

// bookSchema.method('addTag', function (tag) {
//   return this.update({ $addToSet: { tags: tag } }).exec();
// });

mongoose.model('cache', cacheSchema);
