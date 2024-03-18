const aws = require('aws-sdk')

const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3)

const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
})

const listarImagens = async(req, res) => {
    const arquivos = await s3.listObjects({
        Bucket: process.env.BACKBLAZE_BUCKET
    }).promise()

    const files = arquivos.Contents.map((file) => {
        return {
            url: `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3}/${file.Key}`,
            path: file.Key,
        }
    })

    return res.json(files)
}

const uploadImagem = async (path, buffer, mimetype) => {
    const produto_imagem = await s3.upload({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: path,
        Body: buffer,
        ContentType: mimetype
    }).promise()

    return {
        path: produto_imagem.Key,
        url: `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3}/${produto_imagem.Key}`    
    }
}

const excluirImagem = async (path) => {
    
    await s3.deleteObject({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: path
    }).promise()
}

module.exports = {
    listarImagens,
    uploadImagem,
    excluirImagem
}





