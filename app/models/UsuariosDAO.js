const crypto = require("crypto")


function UsuariosDAO(connection){
    this._connection = connection()
}

UsuariosDAO.prototype.insert = function(usuario){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("usuarios", function(err, collection){

            const senhaCrypto = crypto.createHash("md5").update(usuario.senha).digest("hex")
            usuario.senha = senhaCrypto

            collection.insert(usuario)
            mongoclient.close()
        })
    })
}

UsuariosDAO.prototype.auth = function(usuario, req, res){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("usuarios", function(err, collection){
            /*
            só é possível fazer assim "collection.find(usuario)" pq
            os index da variável 'usuario' são os mesmos dos atributos 
            da collection do mongodb
            */

           const senhaCrypto = crypto.createHash("md5").update(usuario.senha).digest("hex")
           usuario.senha = senhaCrypto

            collection.find(usuario).toArray(function(err, result){

                console.log(result.length)

                if(result.length > 0){
                    req.session.autorizado = true
                    req.session.usuario = result[0].usuario
                    req.session.casa = result[0].casa
                } else {
                    req.session.autorizado = false
                }

                if(req.session.autorizado){
                    res.redirect("jogo");
                }else{
                    res.render("index", {validacao: [{msg: "usuário e ou senha inválidos"}]});
                }

            })
            mongoclient.close()
        })
    })
}

module.exports = function(){
    return UsuariosDAO;
}