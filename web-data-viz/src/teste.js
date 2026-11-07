import { buscarJson } from "./S3config.js";

async function testar() {
    try {
        const dados = await buscarJson(
            "gold",
            "1/CryptoSight/treated-data.json"
        );

        console.log("Teste finalizado!");
    } catch (erro) {
        console.error("Erro:", erro);
    }
}

testar();