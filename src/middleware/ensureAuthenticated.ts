import {Request , Response , NextFunction} from  'express'
import {verify} from 'jsonwebtoken'

interface IPayload {
    sub : string
}

export function ensureAuthenticated(request : Request , response: Response , next : NextFunction){
    const authToken = request.headers.authorization;
    if(!authToken){
        return response.status(401).json({
            errorCode : "token invalid"
        })
    }

    //Bearer token...
    // desistruturar o token  virgula para ignorar o primeiro caracter
    const [,token ] = authToken.split(" ")
 
    try {

        const {sub } = verify(token , process.env.MY_SECRET) as IPayload

        request.user_id = sub

        return next()
        
    } catch (error) {
        return response.status(401).json({
            error: "token expired"
        })
    }
}