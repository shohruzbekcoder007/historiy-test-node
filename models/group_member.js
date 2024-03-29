const Joi = require('joi');
const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  teacher_id: {
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
  },
  create_date: {
    type: Date,
    default: new Date()
  }
});

const Member = mongoose.model('members', MemberSchema);

function validateMember(answer) {
  const schema = Joi.object({
    student_id: Joi.string().required(),
    teacher_id: Joi.string().required(),
    group_id: Joi.string().required(),
    status: Joi.boolean()
  });

  return schema.validate(answer);
}

exports.Member = Member;
exports.validate = validateMember;