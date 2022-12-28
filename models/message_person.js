const Joi = require('joi')
const mongoose = require('mongoose')

const MessagePersonSchema = new mongoose.Schema({
  from_message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  to_message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  context_message: {
    type: String,
    required: true
  },
  type_message: {
    type: String,
    required: true,
    enum: ['text', 'file']
  },
  create_date: {
    type: Date,
    default: new Date()
  }
});

const MessagePerson = mongoose.model('message_persons', MessagePersonSchema);

function validateMessagePerson(message) {
  const schema = Joi.object({
    from_message: Joi.string().required(),
    to_message: Joi.string().required(),
    context_message: Joi.string().required(),
    type_message: Joi.string().required(),
    create_date: Joi.date()
  });

  return schema.validate(message);
}

exports.MessagePerson = MessagePerson;
exports.validate = validateMessagePerson;