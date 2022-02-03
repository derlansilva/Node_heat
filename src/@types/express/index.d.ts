//subescrevendo para poder reconhecer o user_id

declare namespace Express{
    export interface Request {
        user_id : string;
    }
}