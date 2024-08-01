import { NextFunction, Request, Response } from "express";
import  Jwt, { JwtPayload }  from "jsonwebtoken";

declare global{
    namespace Express{
        interface Request{
            userId:string;
            //add userId property to request type and than Express namespace
        }
    }
}
const verifyToken=(req:Request, res:Response, next:NextFunction)=>{
    const token=req.cookies['auth_token'];
    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    try{
        const decoded=Jwt.verify(token,process.env.JWT_SECRET_KEY as string);
         //get the user id from decoded token
         req.userId=(decoded as JwtPayload).userId;
         next();
    }
    catch(error){
       return res.status(401).json({
        message:"unauthorized"
       })
    }
}

export default verifyToken