const Joi = require('joi');
const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
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
  material_url: {
    type: String,
    required: true,
  }
});

const Material = mongoose.model('materials', MaterialSchema);

function validateMaterial(answer) {
  const schema = Joi.object({
    teacher_id: Joi.string().required(),
    group_id: Joi.string().required(),
    material_url: Joi.string().required()
  });

  return schema.validate(answer);
}

exports.Material = Material;
exports.validate = validateMaterial;