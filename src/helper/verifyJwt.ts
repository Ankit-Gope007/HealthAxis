import jwt from "jsonwebtoken"


export const verifyJwt = async(token:string) =>{
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET!) as {
        email:string;
        id:string;
    }

    return decodedToken;

}