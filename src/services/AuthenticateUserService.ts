/**
 * Receber code(string)
 * Recuperar acces_token  no github
 * Verificar se o usuario existe no banco de dados
 *--------SIM  = Gera um token
 *--------NÂO  = Cria no DB gera um token
 Retorn um token com as informações do user 

 */

import axios from 'axios'


//
class AuthenticateUserService{
 
    async execute(code:string){
        const url = "https://github.com/login/oauth/access_token"

        const response = await axios.post(url , null , {
            params: {
                client_id : process.env.GITHUB_CLIENT_ID , 
                client_secret : process.env.GITHUB_CLIENT_SECRET,
                code
            },
            headers: {
                "Accept" : "application/json"
            }
        })

        return response.data;
    }
}

export {AuthenticateUserService}