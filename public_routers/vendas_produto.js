import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

//GET
router.get('/venderproduto', async (req, res) => {
    let produtos = await prisma.vendas_produtos.findMany()
    res.status(200).json(produtos)
})

//ROTA PARA REALIZAR UMA VENDA ADICIONANDO UMA LINHA NA TABELA DE VENDAS E UMA LINHA PARA CADA PRODUTO EM VENDAS_PRODUTOS
router.post('/venderproduto', async (req, res) => {
    console.log(req.body);
    try {
        const { idFuncionario, produtos} = req.body

        const valorVenda = produtos.map(array => array.total
        ).reduce((soma, valorArray) =>soma + valorArray, 0)
        console.log('total da venda,',valorVenda)

            await prisma.vendas.create({
            data: {
                //cria uma venda com id do funcionário
                id_funcionario_vendas: idFuncionario,
                valorTotal_vendas: valorVenda,

                //insere as vendas de cada produto na tabela relacionada vendas_produtos
                vendas_produtos: {
                    create: produtos.map(array => ({
                        id_produto: array.id,
                        valorUni: array.valorUni,
                        quantidade: array.quantidade,
                        valorTotal_vendasprodutos :  array.total
                    }))
                }
            },
            include: { vendas_produtos: true }
        })

        res.status(201).json({ message: 'Venda efetuada' })

    } catch (err) {
        console.log(err)
        res.status(400).json({ message: 'Erro na operação' })
    }
})

export default router