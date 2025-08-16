//dependencias
import express from 'express'
import cors from 'cors'

//ORM
import { PrismaClient } from '@prisma/client'

//rotas
import funcionarios from './public_routers/funcionarios.js'
import vendas from './public_routers/vendas.js'
import pruduvendas from './public_routers/vendas_produto.js'
import produtos from './public_routers/produtos.js'

const app = express()
app.use(express.json())
app.use(cors())

const prisma = new PrismaClient()

//rotas
app.use('/', funcionarios)
app.use('/', vendas)
app.use('/', pruduvendas)
app.use('/', produtos)



app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(3000, () => {
    console.log('online')
})