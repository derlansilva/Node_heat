import prismaClient from "../prisma"

//class para retornar as 3 ultimas mensagens
class GetLast3MessagesService{
   async execute(){

    //SELECT * FROM messages LIMIT 3 ORDER_BY desc
       const message = await prismaClient.message.findMany({
           take: 3,
           orderBy:{
               create_at: "desc"
           },
           include: {
               user: true
           }
       })

       return message
   }
}


export { GetLast3MessagesService }