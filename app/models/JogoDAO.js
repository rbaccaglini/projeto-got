const ObjectId = require('mongodb').ObjectID

function JogoDAO(connection){
    this._connection = connection()
}

JogoDAO.prototype.gerarParametros = function(usuario){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("jogo", function(err, collection){
            collection.insert(
                {
                    usuario: usuario,
                    moeda: 15,
                    suditos: 10,
                    temos: Math.floor(Math.random()*1000),
                    sabedoria: Math.floor(Math.random()*1000),
                    comercio: Math.floor(Math.random()*1000),
                    magia: Math.floor(Math.random()*1000)
                }
            )
            mongoclient.close()
        })
    })
}

JogoDAO.prototype.iniciaJogo = function(res, usr, casa, msg){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("jogo", function(err, collection){
            collection.find({usuario: usr}).toArray(function(err, result){
                if(result.length > 0){
                    res.render("jogo", {img_casa: casa, jogo: result[0], msg: msg})
                } else {
                    res.render("jogo", {img_casa: casa, jogo: {}, msg: msg})
                }
                mongoclient.close()
            })
        })
    })
}

JogoDAO.prototype.acao = function(acao){

    this._connection.open(function(err, mongoclient){
        mongoclient.collection("acao", function(err, collection){

            const date = new Date()
            let tempo = 60 * 60 * 1000 // 1h em milissegundos

            switch (parseInt(acao.acao)) {
                case 1:
                    tempo *= 1
                    break
                case 2:
                    tempo *= 2
                    break
                case 3:
                    tempo *= 5
                    break
                case 4:
                    tempo *= 5
                    break
                default:
                    break
            }
            acao.acao_termina_em = date.getTime() + tempo
            collection.insert(acao)
        })

        mongoclient.collection("jogo", function(err, collection){
            let moedas = 0

            switch (parseInt(acao.acao)) {
                case 1:
                    moedas = -2
                    break
                case 2:
                    moedas = -3
                    break
                case 3:
                    moedas = -1
                    break
                case 4:
                    moedas = -1
                    break
                default:
                    break
            }

            moedas *= acao.quantidade
            collection.update(
                {usuario: acao.usuario},
                {$inc: {moedas: moedas}}
            )
            mongoclient.close()
        })


    })

}

JogoDAO.prototype.getAcoes = function(usr, res){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("acao", function(err, collection){

            const date = new Date()
            const agora = date.getTime()

            collection.find({usuario: usr, acao_termina_em: {$gt: agora}}).toArray(function(err, result){
                console.log(result)
                mongoclient.close()
                res.render("pergaminhos", {acoes:result})
            })
        })
    })
}

JogoDAO.prototype.revogarAcao = function(idAcao, res){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("acao", function(err, collection){
            collection.remove(
                {_id: ObjectId(idAcao)},
                function(err, result){
                    res.redirect("jogo?msg=D")
                    mongoclient.close()
                }
            )
        })
    })
}

module.exports = function(){
    return JogoDAO;
}