import 'dotenv/config';
import express  from "express";
import { router } from './routes';
import http from 'http'
import cors from 'cors'
import {Server, Socket} from 'socket.io'


const app = express()
app.use(cors())
const serverHttp = http.createServer(app)
const io  = new Server(serverHttp , {
    cors: {
        origin: "*"
    }
})

io.on("connection" , (socket) => {
    console.log("User connceted on socket " , socket.id)
})
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


export { serverHttp,io}