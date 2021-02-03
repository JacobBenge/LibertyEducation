// SIMPLIFIES THE CODE FOR THE ASYNC EXPRESS ROUTES. THIS REPLACES HAVING CODE NESTED IN TRY-CATCH
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}