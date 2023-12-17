import express from "express"
import logger from "debug"
import cors from "cors"

import { router } from "./infrastructure/routes"
import { requestsLogger } from "./infrastructure/middlewares/requestsLogger"
import { errorHandler } from "./infrastructure/middlewares/errorHandler"
import { routeNotFound } from "./infrastructure/middlewares/routeNotFound"

const apiMainLogger = logger("api:main")

const app = express()

//TODO: Adicionar lógica para enviar mensagens de erro em português
//ou inglês. 
    //A requisição terá um header onde vira as siglas do país
    //e do idioma (EX: "ptBR", "enUS", etc);
    //Um novo objeto personalizado será criado dentro de "req", assim
    //como foi feito para os dados do usuário e dentro desse objeto
    //ficaram contidas todas as mensagens que serão lançadas para o cliente
    //no seguinte formato "req.errorMessages.<IDIOMA>.<MENSAGEM>".
    //EX: req.errorMessages.ptBR.usernameAlreadyinUse
    //O valor desse header será usado para preencher o campo <IDIOMA>.
    //Caso o valor seja indefinido ou um valor não esperado, o valor padrão
    //será "enUS"

//TODO: Configurar o cors corretamente antes do deploy
app.use(cors({
    origin: "*",
    methods: ["GET", "PATCH", "POST", "DELETE"]
}))
app.use(requestsLogger)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/api/v1", router)

app.use(routeNotFound)
app.use(errorHandler)

export { app, apiMainLogger }