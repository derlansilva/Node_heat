import 'dotenv/config';
import express  from "express";
import { router } from './routes';


const app = express()
app.use(express.json())

app.use(router)
// url que direciona para a url de authenticação do github , passando o client id gerado na 
app.get('/github' , ( req , res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
})

//rota por onde a url de authenticação do github retorna o token 
app.get('/signin/callback' , (req , res) => {
    const {code} = req.query //pegando o key que foi passado pelo github na Url
    return res.json(code)
})

app.listen(3333 , () => console.log(`Server running on port 3333`))