const jwt = require("jsonwebtoken")

function auth(req, res, next) {
    try {
        const token = req.cookies.token

        if(!token) {
            return res.status(401).json({ errorMessage: "Unauthorized" })
        } 

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified.user

        next() //(express function) it is used to exit out of the middleware function
    } catch(err) {
        console.log(err)
        res.status(401).json({ errorMessage: "Unauthorized" })
    }
}

module.exports = auth