
const { Router } = require('express');
const { check } = require('express-validator');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const {
    validarCampos, 
    validarJWT, 
    esAdminRole, 
    tieneRole
} = require('../middlewares');

const { usuariosGet,
        usuariosPost,
        usuariosPatch,
        usuariosDelete,
        usuariosPut } = require('../controllers/usuarios');




const router = Router();


router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido ),
    validarCampos
] ,usuariosPut);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de más de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROL','USER_ROL']),
    check('rol').custom( esRoleValido ),
    validarCampos
] ,usuariosPost);



router.patch('/',usuariosPatch);

router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROL','VENTAS_ROL'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete);





module.exports = router;




