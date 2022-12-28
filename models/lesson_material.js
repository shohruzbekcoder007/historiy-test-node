const Joi = require('joi');
const mongoose = require('mongoose');

const LessonMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lessons",
  },
  sourse_test_id: {
    type: String,
    default: "",
  },
  sourse_post_id: {
    type: String,
    default: "",
  },
  sourse_file_id: {
    type: String,
    default: "",
  }
});

const LessonMaterial = mongoose.model('lessonmaterials', LessonMaterialSchema);

function validateLessonMaterial(material) {
  const schema = Joi.object({
    lesson_id: Joi.string().required(),
    sourse: Joi.string().required()
  });

  return schema.validate(material);
}

exports.LessonMaterial = LessonMaterial;
exports.validateLessonMaterial = validateLessonMaterial;