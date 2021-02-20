// IN HIND SIGHT, EXPRESS VALIDATOR MAY HAVE BEEN THE BETTER OPTION FOR VALIDATION AND HTML SANTIZATION
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

//https://github.com/sideway/joi/issues/2453 WITH THIS EXTENSION, WE CAN ADD escapeHTML() TO EACH OF OUR VALIDATION TO ENSURE NO HTML GETS SAVED. EXAMPLE IS TO INPUT <script>alert("hello there")</script> IN ANY FIELD, SUCH AS FIRSTNAME
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

// ADDS OUR HTML SANITIZER EXTENSION TO BASE JOI
const Joi = BaseJoi.extend(extension);

// MUST MATCH models/student.js
// MANAGES THE DATATYPES ALLOWED TO PASS THROUGH MONGOOSE AND INTO MONGODB. ANOTHER LEVEL ON TOP OF BROWSER FORM VALIDATION. THIS PREVENTS INVALID DATA FROM ENTERING DB WHEN USING POSTMAN.
module.exports.studentSchema = Joi.object({
    student: Joi.object({
        firstName: Joi.string().trim().required().escapeHTML(),
        lastName: Joi.string().trim().required().escapeHTML(),
        prefName: Joi.string().trim().allow('').optional().escapeHTML(),
        dateOfBirth: Joi.string().trim().required().escapeHTML(),
        schoolYear: Joi.number().allow('').optional(),
        primaryContactFirst: Joi.string().trim().required().escapeHTML(),
        primaryContactLast: Joi.string().trim().required().escapeHTML(),
        primaryContactRelationship: Joi.string().trim().valid('Self','Mother','Father','Mother-in-law','Father-in-law','Grandmother','Grandfather','Guardian','Sister','Brother', 'Other-Relative', 'Other-Nonrelative', 'Unknown').required().escapeHTML(),
        primaryContactPhone: Joi.string().trim().required().escapeHTML(),
        primaryContactEmail: Joi.string().trim().required().escapeHTML(),
        secondaryContactFirst: Joi.string().trim().allow('').optional().escapeHTML(),
        secondaryContactLast: Joi.string().trim().allow('').optional().escapeHTML(),
        secondaryContactRelationship: Joi.string().trim().valid('Self','Mother','Father','Mother-in-law','Father-in-law','Grandmother','Grandfather','Guardian','Sister','Brother', 'Other-Relative', 'Other-Nonrelative', 'Unknown').allow('').optional().escapeHTML(),
        secondaryContactPhone: Joi.string().trim().allow('').optional().escapeHTML(),
        secondaryContactEmail: Joi.string().trim().allow('').optional().escapeHTML(),
        addressLine1: Joi.string().trim().required().escapeHTML(),
        addressLine2: Joi.string().trim().allow('').optional().escapeHTML(),
        city: Joi.string().trim().required().escapeHTML(),
        stateCode: Joi.string().trim().valid('AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY').length(2).required().escapeHTML(),
        zipCodeBase: Joi.number().required(),
        zipCodeExtension: Joi.number().allow('').optional(),
        gender: Joi.string().trim().valid('Male','Female','Unknown').required().escapeHTML()
    }).required()
})

// MUST MATCH models/attendance.js
module.exports.attendanceSchema = Joi.object({
    attendance: Joi.object({
        attendanceDate: Joi.date().greater('01-01-2021').required(),
        attendanceCode: Joi.string().trim().valid('present', 'tardy', 'absent', 'excused absence').required().escapeHTML(),
        comment: Joi.string().trim().allow('').optional().escapeHTML()
    }).required()
})

// MUST MATCH models/homework.js
module.exports.homeworkSchema = Joi.object({
    homework: Joi.object({
        subjectLine: Joi.string().trim().required().escapeHTML(),
        url: Joi.string().trim().allow('').optional().escapeHTML(),
        stuId: Joi.string().trim().required().escapeHTML(),
        assignedStudent: Joi.string().trim().allow('').optional().escapeHTML(),
        category: Joi.string().trim().valid('Reading', 'Writing', 'Math', 'Science', 'Social Studies', 'Physical Ed.', 'Art', 'Music', 'Other').required().escapeHTML(),
        dueDate: Joi.string().trim().required().escapeHTML(),
        pointsPossible: Joi.number().min(0).max(999).required(),
        description: Joi.string().trim().required().escapeHTML(),
    }).required()
})

// MUST MATCH models/user.js
module.exports.userSchema = Joi.object({
    user: Joi.object({
        userRegistrationCode: Joi.string().trim().min(24).max(24).required().escapeHTML(), 
        email: Joi.string().trim().required().escapeHTML(),
        username: Joi.string().trim().required().escapeHTML()
    }).required()
})