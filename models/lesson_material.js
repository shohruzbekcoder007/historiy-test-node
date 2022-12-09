const Joi = require('joi');
const mongoose = require('mongoose');

const LessonMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

const LessonMaterial = mongoose.model('lessonmaterials', LessonMaterialSchema);

function validateLessonMaterial(material) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
  });

  return schema.validate(material);
}

exports.LessonMaterial = LessonMaterial;
exports.validateLessonMaterial = validateLessonMaterial;