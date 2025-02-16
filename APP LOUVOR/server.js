const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/getCifra', async (req, res) => {
    const songName = req.query.song; // nome da música fornecido pela query string
    const url = `https://www.cifraclub.com.br/busca/?q=${encodeURIComponent(songName)}`;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        // Pega o primeiro resultado da busca
        const songLink = $('.search-result__title a').attr('href');
        
        if (!songLink) {
            return res.status(404).json({ message: 'Cifra não encontrada.' });
        }

        const songPage = await axios.get(songLink);
        const $$ = cheerio.load(songPage.data);
        
        // Pega a cifra da página da música
        const cifra = $$('pre#cifra').text();

        if (!cifra) {
            return res.status(404).json({ message: 'Cifra não encontrada.' });
        }

        res.json({ cifra });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar a cifra.' });
    }
});

app.listen(port, () => {
    console.log(`Server rodando em http://localhost:${port}`);
});
