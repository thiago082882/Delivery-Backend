const categoriasController = require('../controllers/categoriasController');
const passport = require('passport')


module.exports = (app,upload) => {


// TRAZER DADOS 

app.get('/api/categorias/getAll',passport.authenticate('jwt',{session:false}),categoriasController.getAll);

// GUARDAR DADOS

app.post('/api/categorias/create',passport.authenticate('jwt',{session:false}),upload.array('image', 1),categoriasController.create);


}