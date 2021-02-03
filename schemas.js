const Joi = require('joi');

// MUST MATCH models/student.js
// MANAGES THE DATATYPES ALLOWED TO PASS THROUGH MONGOOSE AND INTO MONGODB. ANOTHER LEVEL ON TOP OF BROWSER FORM VALIDATION. THIS PREVENTS INVALID DATA FROM ENTERING DB WHEN USING POSTMAN.
module.exports.studentSchema = Joi.object({
    student: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        dateOfBirth: Joi.string().allow('').optional(),
        schoolYear: Joi.number().allow('').optional(),
        primaryContactFirst: Joi.string().required(),
        primaryContactLast: Joi.string().required(),
        primaryContactRelationship: Joi.string().required(),
        primaryContactPhone: Joi.string().required(),
        primaryContactEmail: Joi.string().required(),
        secondaryContactFirst: Joi.string().allow('').optional(),
        secondaryContactLast: Joi.string().allow('').optional(),
        secondaryContactRelationship: Joi.string().allow('').optional(),
        secondaryContactPhone: Joi.string().allow('').optional(),
        secondaryContactEmail: Joi.string().allow('').optional(),
        addressLine1: Joi.string().required(),
        addressLine2: Joi.string().required(),
        city: Joi.string().required(),
        stateCode: Joi.string().required().min(2).max(2),
        zipCodeBase: Joi.number().required(),
        zipCodeExtension: Joi.number().allow('').optional()
    }).required()
})

// MUST MATCH models/attendance.js
module.exports.attendanceSchema = Joi.object({
    attendance: Joi.object({
        date: Joi.string().required(),
        enum: Joi.string().required().valid('present', 'tardy', 'absent', 'excused absence')
    }).required()
})