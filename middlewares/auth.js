const {verifyToken} = require("../services/auth")

function checkAuthentication(cookieName){
    return async (req,res,next)=>{
        const token = await req.cookies[cookieName];
        if(!token){
            return next();
        }
        try{
            const userPayload = await verifyToken(token);
            req.user = userPayload
        }catch(err){}

        return next();
    }
}

module.exports = {checkAuthentication}