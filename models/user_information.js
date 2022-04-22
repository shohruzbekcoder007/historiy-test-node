const mongoose = require('mongoose');

const userInformationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true
  },
  level: {
    type: Number,
    default: 1
  },
  level__reight_answers: {
    type: Number,
    default: 1,
  },
  all_reight_answers: {
    type: Number,
    default: 1,
  }
});

const UserInformation = mongoose.model('user_informations', userInformationSchema);

exports.UserInformation = UserInformation;