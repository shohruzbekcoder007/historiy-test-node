const Joi = require('joi');
const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
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
  lesson_material_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lessonmaterials",
    required: true,
  }
});

const Lesson = mongoose.model('lessons', LessonSchema);

function validateLesson(lesson) {
  const schema = Joi.object({
    teacher_id: Joi.string().required(),
    group_id: Joi.string().required(),
    lesson_material_id: Joi.string().required()
  });

  return schema.validate(lesson);
}

exports.Lesson = Lesson;
exports.validate = validateLesson;