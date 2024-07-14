const JWT = require("jsonwebtoken");
const secretKey = "HA(k@1234$uperMAN"

async function createTokenForUser(user){
    const Payload = {
        _id:user._id,
        userName:user.userName,
        email:user.email,
        role:user.role,
    }

    const token = JWT.sign(Payload,secretKey);
    
    return token;
}

async function verifyToken(token){
    const Payload = JWT.verify(token,secretKey);
    return Payload;
}

module.exports = {
    createTokenForUser,
    verifyToken
}