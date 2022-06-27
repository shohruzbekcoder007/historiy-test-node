const Joi = require('joi');
const mongoose = require('mongoose');

const userProfileInfoSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    image_url: {
        type: String
    },
});

const UserProfileInfo = mongoose.model('userinformations', userProfileInfoSchema);

function validateUserProfileInfo(answer) {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    image_url: Joi.string(),
  });

  return schema.validate(answer);
}

exports.UserProfileInfo = UserProfileInfo;
exports.validate = validateUserProfileInfo;