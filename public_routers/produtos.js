import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/produtos', async (req, res) => {
    let produtos = await prisma.produtos.findMany()
    res.status(200).json(produtos)
})


//rota para dar baixa ao concluir uma venda
router.put('/produtos/:id/baixa', async (req, res) => {
    try {
        if (!req.params.id) {
            return (
                res.status(400).json({ message: 'ID não definida' })
            )
        }

        const id = Number(req.params.id)

        // 1. Busca todos os produtos dessa venda
        const itensVenda = await prisma.vendas_produtos.findMany({
            where: { id_venda: id },
            include: { produtos: true } // traz também os dados do produto
        })

        if (itensVenda.length === 0) {
            return res.status(404).json({ message: 'Nenhum produto encontrado para essa venda' })
        }

        // 2. Atualiza o estoque de cada produto
        for (const item of itensVenda) {
            await prisma.produtos.update({
                where: { id_produtos: item.id_produto },
                data: {
                    estoque_produtos: {
                        decrement: item.quantidade // Prisma já suporta decremento seguro
                    }
                }
            })
        }

        res.status(201).json({ message: 'Estoque atualizado' })

    } catch (err) {
        console.log('Erro na execução do sql', err)
        res.status(500).json(err)
    }
})

//rota para realizar uma devolução
router.put('/produtos/:id/entrada', async (req, res) => {
    try {
        if (!req.params.id) {
            return (
                res.status(400).json({ message: 'ID não definida' })
            )
        }

        const id = Number(req.params.id)

        // 1. Busca todos os produtos dessa venda
        const itensVenda = await prisma.vendas_produtos.findMany({
            where: { id_venda: id },
            include: { produtos: true } // traz também os dados do produto
        })

        if (itensVenda.length === 0) {
            return res.status(404).json({ message: 'Nenhum produto encontrado para essa venda' })
        }

        // 2. Atualiza o estoque de cada produto
        for (const item of itensVenda) {
            await prisma.produtos.update({
                where: { id_produtos: item.id_produto },
                data: {
                    estoque_produtos: {
                        increment: item.quantidade // Prisma já suporta decremento seguro
                    }
                }
            })
        }

        res.status(201).json({ message: 'Estoque atualizado' })

    } catch (err) {
        console.log('Erro na execução do sql', err)
        res.status(500).json(err)
    }
})

export default router