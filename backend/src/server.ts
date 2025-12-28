import express from "express"
import type { Express } from "express"
import cors from "cors"
import cookierParser from "cookie-parser"
import env from "./utils/env.js"


const app: Express = express()

// middlewares
app.use(cors())
app.use(cookierParser())

const PORT:number=env.PORT

app.listen(PORT,():void=>console.log(`server has started on port ${PORT}`))

