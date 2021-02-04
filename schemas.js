const Joi = require('joi');

// MUST MATCH models/student.js
// MANAGES THE DATATYPES ALLOWED TO PASS THROUGH MONGOOSE AND INTO MONGODB. ANOTHER LEVEL ON TOP OF BROWSER FORM VALIDATION. THIS PREVENTS INVALID DATA FROM ENTERING DB WHEN USING POSTMAN.
module.exports.studentSchema = Joi.object({
    student: Joi.object({
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        dateOfBirth: Joi.string().trim().allow('').optional(),
        schoolYear: Joi.number().allow('').optional(),
        primaryContactFirst: Joi.string().trim().required(),
        primaryContactLast: Joi.string().trim().required(),
        primaryContactRelationship: Joi.string().trim().required(),
        primaryContactPhone: Joi.string().trim().required(),
        primaryContactEmail: Joi.string().trim().required(),
        secondaryContactFirst: Joi.string().trim().allow('').optional(),
        secondaryContactLast: Joi.string().trim().allow('').optional(),
        secondaryContactRelationship: Joi.string().trim().allow('').optional(),
        secondaryContactPhone: Joi.string().trim().allow('').optional(),
        secondaryContactEmail: Joi.string().trim().allow('').optional(),
        addressLine1: Joi.string().trim().required(),
        addressLine2: Joi.string().trim().required(),
        city: Joi.string().trim().required(),
        stateCode: Joi.string().trim().length(2).required(),
        zipCodeBase: Joi.number().required(),
        zipCodeExtension: Joi.number().allow('').optional()
    }).required()
})

// MUST MATCH models/attendance.js
module.exports.attendanceSchema = Joi.object({
    attendance: Joi.object({
        attendanceDate: Joi.date().greater('01-01-2021').required(),
        attendanceCode: Joi.string().trim().valid('present', 'tardy', 'absent', 'excused absence'),
        comment: Joi.string().trim().allow('').optional()
    }).required()
})