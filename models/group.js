const Joi = require('joi');
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  group_name: {
    type: String,
    required: true,
    minlength: 3
  }
});

const Group = mongoose.model('groups', GroupSchema);

function validateGroup(answer) {
  const schema = Joi.object({
    teacher_id: Joi.string().required(),
    group_name: Joi.string().min(3).required(),
  });

  return schema.validate(answer);
}

exports.Group = Group;
exports.validate = validateGroup;