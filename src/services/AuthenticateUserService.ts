/**
 * Receber code(string)
 * Recuperar acces_token  no github
 * Recuperar info do users no github
 * Verificar se o usuario existe no banco de dados
 *--------SIM  = Gera um token
 *--------NÂO  = Cria no DB gera um token
 Retorn um token com as informações do user 

 */

import axios from 'axios'

interface IAccesTokenResponse{

    access_token : string

}

interface IUserResponse{
    avartar_url : string,
    login : string,
    id: number,
    name : string
}


class AuthenticateUserService{
 
    async execute(code:string){
        const url = "https://github.com/login/oauth/access_token"

        const { data : accessTokenResponse} = await axios.post<IAccesTokenResponse>(url , null , {
            params: {
                client_id : process.env.GITHUB_CLIENT_ID , 
                client_secret : process.env.GITHUB_CLIENT_SECRET,
                code
            },
            headers: {
                "Accept" : "application/json"
            }
        })

        const response = await  axios.get<IUserResponse>("https://api.github.com/user" , {
            headers: {
                authorization: `Bearer ${accessTokenResponse.access_token}`
            }
        })

        return response.data;
    }
}

export {AuthenticateUserService}