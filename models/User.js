const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: [{
            validator:  (value) => value.replace(/ /g) === value,
            msg: 'Username cannot contain whitespaces'
        }]
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    registerDate: {
        type: Date,
        default: Date.now
    },
    // boards: [{ type: String }],
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'board' }]
});

//uniqueness validators
UserSchema.path('email').validate(async (value) => {
    const emailCount = await mongoose.models.user.countDocuments({ email: value });
    return !emailCount;
}, 'Email already exists');

UserSchema.path('name').validate(async (value) => {
    const nameCount = await mongoose.models.user.countDocuments({ name: value });
    return (!nameCount);
}, 'Username already exists');

module.exports = User = mongoose.model('user', UserSchema);