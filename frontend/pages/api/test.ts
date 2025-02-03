import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Fazendo a requisição para o backend Django Ninja
        const response = await fetch("http://127.0.0.1:8000/api/test");
        const data = await response.json();

        // Respondendo com os dados da API
        return res.status(200).json(data);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return res.status(500).json({ error: "Erro ao buscar dados do backend" });
    }
}
