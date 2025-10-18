//dependencias
import express from 'express'
import cors from 'cors'

import path from 'path'
import { fileURLToPath } from 'url'

//ORM
import { PrismaClient } from '@prisma/client'

//SOCKET
import http from "http";
import { Server } from "socket.io";

//rotas
import funcionarios from './public_routers/funcionarios.js'
import vendas from './public_routers/vendas.js'
import pruduvendas from './public_routers/vendas_produto.js'
import produtos from './public_routers/produtos.js'

//Instancia para criação de rotas
const app = express()
app.use(express.json())
app.use(cors());

// Instancia para manipular o Banco de dados
const prisma = new PrismaClient()

// Necessário para funcionar corretamente com módulos ES (import/export)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Servir arquivos estáticos (como CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')))



/****************************SOCKET***************************** */

// Criando instancia servidor HTTP
const server = http.createServer(app);

// Criando servidor Socket.IO
const io = new Server(server, {});

io.on("connection", (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    // Recebendo mensagem do cliente
    socket.on("mensagem", (data) => {

        const nome = data.map(array => array.nome)

        console.log(`Pedido recebido: ${JSON.stringify(data)}`);
        
        // Envia para todos os clientes conectados
        io.emit("mensagem_retorno", data);
    });

    // Desconexão
    socket.on("disconnect", () => {
        console.log(`Usuário desconectado: ${socket.id}`);
    });
});

// Rota principal envia o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

//rotas
app.use('/', funcionarios)
app.use('/', vendas)
app.use('/', pruduvendas)
app.use('/', produtos)



app.get('/', (req, res) => {
    res.send('hello world')
})

server.listen(3001, () => {
    console.log('online')
})