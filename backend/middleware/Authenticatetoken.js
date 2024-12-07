const jwt = require('jsonwebtoken')
//checks if request came loaded with the token and if that token is valid, then request is valid 

const requireAuth = (req, res, next) =>{

    console.log("Authorization middleware called");
    console.log("Headers:", req.headers);

    //verify authentication 
    const {authorization} = req.headers
    console.log("Authorization token required")

    //if header not given, not authorized 
    if (!authorization){
        
        
        return res.status(401).json({error: 'Authorization token required'})
    }

    const token = authorization.split(' ')[1]
    console.log("Token", token);

    //try to verify token 
    try{
        const {_id} = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Verified", _id);
        req.user = { id: _id }
        next()
    }
    catch(error){
        console.log(error)
        res.status(401).json({error: 'Request is not authorized'})
    }


}

module.exports = { requireAuth }