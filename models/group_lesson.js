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
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

const Lesson = mongoose.model('lessons', LessonSchema);

function validateLesson(lesson) {
  const schema = Joi.object({
    teacher_id: Joi.string().required(),
    group_id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    lesson_material_id: Joi.string()
  });

  return schema.validate(lesson);
}

exports.Lesson = Lesson;
exports.validate = validateLesson;