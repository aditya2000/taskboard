const router = require("express").Router()
const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Register
router.post("/", async(req, res) => {
    try {
        const {email, password, passwordVerify} = req.body;
        if(!email || !password || !passwordVerify) {
            return res.status(400).json({errorMessage: "Please enter all required fields"}); // bad request
        }

        if(password.length < 6) {
            return res.status(400).json({errorMessage: "Password should be at least 6 characters long "}); // bad request
        }

        if(password != passwordVerify) {
            return res.status(400).json({errorMessage: "Please enter the same password twice"}); // bad request
        }

        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({
                errorMessage: "An account with this email already exists"
            })
        }

        //hashing the password
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        // save the new user to the database
        const newUser = new User({
            email, passwordHash
        })

        const savedUser = await newUser.save()

        //sign the token
        const token = jwt.sign({
            user: savedUser._id
        }, process.env.JWT_SECRET)

        // send the token in a cookie (http only cookie)
        res.cookie("token", token, {
            httpOnly: true
        }).send()


    } catch(err) {
        console.error(err);
        res.status(500).send(); // internal server error
    }
})


//Login 

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        // Validation
        if(!email || !password) {
            return res.status(400).json({errorMessage: "Please enter all required fields"}); // bad request
        }

        const existingUser = await User.findOne({email})

        if(!existingUser) {
            return res.status(401).json({errorMessage: "Invalid email or password"}) // Unauthorized Request
        }

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash)
        if(!passwordCorrect) {
            return res.status(401).json({errorMessage: "Invalid email or password"}) // Unauthorized Request
        }

        //sign the token
        const token = jwt.sign({
            user: existingUser._id
        }, process.env.JWT_SECRET)

        // send the token in a cookie (http only cookie)
        res.cookie("token", token, {
            httpOnly: true
        }).send()


    } catch(err) {
        console.error(err);
        res.status(500).send(); // internal server error
    }
})


// logout

router.get("/logout", (req, res)=> {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    }).send()
})


router.get("/loggedIn", (req, res) => {
    try {
        const token = req.cookies.token

        if(!token) {
            return res.json(false)
        } 

        jwt.verify(token, process.env.JWT_SECRET)
        res.send(true)
    } catch(err) {
        res.json(false)
    }
})


module.exports = router;