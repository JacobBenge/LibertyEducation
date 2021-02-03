// PASSES ADDITIONAL ERROR INFO (MESSAGE AND STATUSCODE) TO APP.ALL IN EXPRESS APP.ALL 
class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

//EXPORTS EXPRESSERROR
module.exports = ExpressError;