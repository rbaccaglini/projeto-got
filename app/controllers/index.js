module.exports.index = function(application, req, res){
    res.render("index", {validacao: {}})
}

module.exports.autenticar = async function(application, req, res){
    
    const dadosForm = req.body

    req.assert('usuario', 'Usuário incorreto').notEmpty()
    req.assert('senha', 'Senha incorreta').notEmpty()

    const err = req.validationErrors()

    if(err){
        res.render("index", {validacao: err})
        return
    }

    const conn = application.config.dbconn
    const usuarioDAO = new application.app.models.UsuariosDAO(conn)
    await usuarioDAO.auth(dadosForm, req, res)
}
