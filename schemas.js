const Joi = require('joi');

// MUST MATCH models/student.js
// MANAGES THE DATATYPES ALLOWED TO PASS THROUGH MONGOOSE AND INTO MONGODB. ANOTHER LEVEL ON TOP OF BROWSER FORM VALIDATION. THIS PREVENTS INVALID DATA FROM ENTERING DB WHEN USING POSTMAN.
module.exports.studentSchema = Joi.object({
    student: Joi.object({
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        prefName: Joi.string().trim().allow('').optional(),
        dateOfBirth: Joi.date().greater('01-01-1900').allow('').optional(),
        schoolYear: Joi.number().allow('').optional(),
        primaryContactFirst: Joi.string().trim().required(),
        primaryContactLast: Joi.string().trim().required(),
        primaryContactRelationship: Joi.string().trim().valid('Self','Mother','Father','Mother-in-law','Father-in-law','Grandmother','Grandfather','Guardian','Sister','Brother', 'Other-Relative', 'Other-Nonrelative', 'Unknown').required(),
        primaryContactPhone: Joi.string().trim().required(),
        primaryContactEmail: Joi.string().trim().required(),
        secondaryContactFirst: Joi.string().trim().allow('').optional(),
        secondaryContactLast: Joi.string().trim().allow('').optional(),
        secondaryContactRelationship: Joi.string().trim().valid('Unknown','Mother','Father','Mother-in-law','Father-in-law','Grandmother','Grandfather','Guardian','Sister','Brother', 'Other-Relative', 'Other-Nonrelative').allow('').optional(),
        secondaryContactPhone: Joi.string().trim().allow('').optional(),
        secondaryContactEmail: Joi.string().trim().allow('').optional(),
        addressLine1: Joi.string().trim().required(),
        addressLine2: Joi.string().trim().allow('').optional(),
        city: Joi.string().trim().required(),
        stateCode: Joi.string().trim().valid('AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY').length(2).required(),
        zipCodeBase: Joi.number().required(),
        zipCodeExtension: Joi.number().allow('').optional(),
        gender: Joi.string().trim().valid('Male','Female','Unknown').required()
    }).required()
})

// MUST MATCH models/attendance.js
module.exports.attendanceSchema = Joi.object({
    attendance: Joi.object({
        attendanceDate: Joi.date().greater('01-01-2021').required(),
        attendanceCode: Joi.string().trim().valid('present', 'tardy', 'absent', 'excused absence').required(),
        comment: Joi.string().trim().allow('').optional()
    }).required()
})