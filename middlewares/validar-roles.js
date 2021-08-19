const { response } = require("express")



const esAdminRole = (req, res = response, next ) => {

    if( !req.usuario ){
        return status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }
    
    const {rol, nombre} = req.usuario;
    if( rol !== 'ADMIN_ROL' ){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede realizar esta tarea`
        })

    }

    next();
}


const tieneRole = ( ...roles  ) => {

    return (req, res = response, next) => {
        
        if( !req.usuario ){
            return status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }

        // Validar que el rol del usuario coincida con el permitido
        if( !roles.includes(req.usuario.rol )){
            return res.status(401).json({
                msg: `El servicio reequiere uno de estos roles ${roles}`
            })
        }

        next();
    }

}





module.exports = {
    esAdminRole,
    tieneRole
}