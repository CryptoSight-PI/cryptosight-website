
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const bucket_bronze = process.env.AWS_BUCKET_RAW || process.env.AWS_BUCKET_BRONZE;
const bucket_silver = process.env.AWS_BUCKET_SILVER;
const bucket_gold = process.env.AWS_BUCKET_GOLD;

const s3 = new S3Client({
    region: process.env.AWS_DEFAULT_REGION
});

export async function buscarJson(camada, caminho) {

    let bucket;

    if (camada === "bronze") {
        bucket = bucket_bronze;
    } else if (camada === "silver") {
        bucket = bucket_silver;
    } else if (camada === "gold") {
        bucket = bucket_gold;
    } else {
        throw new Error("Camada inválida!");
    }

    if (!bucket) {
        throw new Error("Bucket não configurado no .env");
    }

    const comando = new GetObjectCommand({
        Bucket: bucket,
        Key: caminho
    });

    const resposta = await s3.send(comando);

    if (!resposta.Body) {
        throw new Error("Arquivo não encontrado ou sem conteúdo!");
    }

    const conteudo = await resposta.Body.transformToString();

    const dados = JSON.parse(conteudo);

    console.log("JSON acessado com sucesso!");
    console.log(dados);

    return dados;
}
