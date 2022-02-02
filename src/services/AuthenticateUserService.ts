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
import prismaClient from '../prisma'
import { sign } from 'jsonwebtoken'


interface IAccesTokenResponse {

    access_token: string

}

interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}


class AuthenticateUserService {

    async execute(code: string) {
        const url = "https://github.com/login/oauth/access_token"

        const { data: accessTokenResponse } = await axios.post<IAccesTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            headers: {
                "Accept": "application/json"
            }
        })

        const response = await axios.get<IUserResponse>("https://api.github.com/user", {
            headers: {
                authorization: `Bearer ${accessTokenResponse.access_token}`
            }
        })

        const { login, avatar_url, id, name } = response.data
        //buscando o usuario se o github_id = id
        let user = await prismaClient.user.findFirst({
            where: {
                github_id: id
            }
        })

        //se o usuario não existir vamos criar ele
        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    github_id: id,
                    login,
                    avatar_url,
                    name

                }
            })
        }
        const token = sign(
            //primeiro parametro são informações do usuario
            {
                user: {
                    user: user.name,
                    avatar_url: user.avatar_url,
                    id: user.id
                }
            },
            //segundo parametro e uma secret que serve tanto para validar quando para verificar se o usuario ja esta logado ou não

            process.env.MY_SECRET,
            {
                subject: user.id,
                expiresIn : '1d'
            }
        )

        return {token ,user}
    }
}

export { AuthenticateUserService }