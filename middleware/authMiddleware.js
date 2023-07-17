const jwt = require("jsonwebtoken");
require("dotenv").config();


const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.secretKey);
            if (decoded) {
                req.userId = decoded.userId;
                req.userName = decoded.userName;
                next();
            } else {
                res.status(400).json({ msg: "user is not authorized" })
            }
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }else{
        res.status(400).json({msg:"login to continue"})
    }
}

module.exports={authMiddleware}