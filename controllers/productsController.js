const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');
const { findByCategory } = require('../models/product');

module.exports = {


 //Metodo para listar os produtos 

 async findByCategory(req,res,next){

try {

    const id_category = req.params.id_category;  //Cliente 
    const data = await Product.findByCategory(id_category);

    return res.status(201).json(data);
    
} catch (error) {
        console.log(`Error: ${error}`);
        return res.status(501).json({
             message : `Error ao listar o produto por categoria`,
            success: false,
            error: error 
        });
}

// fim 

},

    async create(req,res,next){

       let product = JSON.parse(req.body.product);

        const files = req.files;

        let inserts = 0;

        if  (files.length === 0 ){
            return res.status(501).json({

                message : 'Error ao registrar o produto não tem imagem',
                success: false
            });
        }
        else { 
            try {

             const data  = await Product.create(product); // Armazenando  a informacao do produto 
             product.id = data.id;

             const start = async() => {
                await asyncForEach(files,async(file)=>{

                const pathImage = `image_${Date.now()}`;
                const url = await storage(file,pathImage);

                if(url !== undefined && url !== null ){
                    if(inserts == 0 ){ // Guardar Imagem 1
                        product.image1 = url;

                    }else if (inserts == 1){// Guardar Imagem 2
                        product.image2 = url;

                    }
                    else if (inserts ==2){// Guardar Imagem 3
                        product.image3 = url;

                    }
                }

                await Product.update(product);

                inserts = inserts + 1;

                if (inserts == files.length){
                    return res.status(201).json({
                        success: true,
                        message: 'O produto foi registrado corretamente'

                    });
                }

                });
             }
        
               start();
                
            } catch (error) {
                console.log(`Error: ${error}`);
                return res.status(501).json({
                    message : `Error ao registrar o produto ${error}`,
                    success: false,
                    error: error 

                });
                
            }
        }
    }
}