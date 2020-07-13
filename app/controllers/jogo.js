module.exports.jogo = function(application, req, res){
    if(!req.session.autorizado){
        res.render("index", {validacao: [{msg: "Só pra usuário autenticados"}]})
        return
    }

    const conn = application.config.dbconn
    const jogoDAO = new application.app.models.JogoDAO(conn)

    jogoDAO.iniciaJogo(res, req.session.usuario, req.session.casa)

}

module.exports.sair = function(application, req, res){

    req.session.destroy(function(err){
        res.render("index", {validacao:{}})
    })

}