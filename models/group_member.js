const Joi = require('joi');
const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "groups",
    required: true,
  },
  status: {
    type: Boolean,
    default: false
  }
});

const Member = mongoose.model('members', MemberSchema);

function validateMember(answer) {
  const schema = Joi.object({
    student_id: Joi.string(),
    group_id: Joi.string().required(),
    status: Joi.boolean()
  });

  return schema.validate(answer);
}

exports.Member = Member;
exports.validate = validateMember;