module.exports.cadastro = function(application, req, res) {
    res.render("cadastro", {validacao: {}, dadosForm: {}})
}

module.exports.cadastrar = function(application, req, res) {
    
    const dadosForm = req.body

    req.assert('nome', 'Nome não pode ser vaziu').notEmpty()
    req.assert('senha', 'Senha não pode ser vaziu').notEmpty()
    req.assert('usuario', 'Usuário não pode ser vaziu').notEmpty()
    req.assert('casa', 'Selecione uma casa').notEmpty()

    const err = req.validationErrors()

    if(err){
        res.render('cadastro', {validacao: err, dadosForm: dadosForm}) 
        return
    }

    const conn = application.config.dbconn
    const usuarioDAO = new application.app.models.UsuariosDAO(conn)
    const jogoDAO = new application.app.models.JogoDAO(conn)

    usuarioDAO.insert(dadosForm)
    jogoDAO.gerarParametros(dadosForm.usuario)

    res.send('OK...')

}