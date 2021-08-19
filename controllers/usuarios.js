const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');



const usuariosGet = async(req = request, res = response) => {

    //desestructuración de argumentos.

    const { limite = 5, desde = 0 } = req.query; 
    const query = { estado: true}; // condicion

    //const usuarios = await Usuario.find(query)
    //    .skip( Number(desde))
    //    .limit(Number(limite));

    //const total = await Usuario.countDocuments(query);
    
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip( Number(desde))
        .limit(Number(limite))
    ])
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    //acá viene la información proporcionada 
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const {id} = req.params;
    const { _id, password, google, correo, ...resto} = req.body;

    // TODO validar contra Base de Datos
    if ( password ){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'Patch API - controlador'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    //const uid = req.uid;  ====> Viene de validar-jwt.js

    // Borrado Físicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    // Borrado lógico
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false });

    //const usuarioAutenticado = req.usuario; ===> Viene de validar-jwt.js

    res.json(usuario);
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}