const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const Product = require('../../model/Product')

class ProductsController{
    //[get]: /allProduct
    home(req,res){
        const getAllProduct = async()=>{
            try{
                const allProduct = await Product.find({})
                return res.status(201).json(allProduct)
            }catch(err){
                console.log(err.message)
                return res.status(500).json({
                    message: "loi server"
                })
            }
        }
        getAllProduct()
    }

    //[post]: /createProducts
    createProducts(req,res){
        const mainProductFile = req.files['mainProduct'][0]
        const fileNameProducts = req.files['products']
        if(fileNameProducts.length > 2){
            return res.status(401).json({
                message: "only 2 file, products two file"
            })
        }
        const productsFile = fileNameProducts.map(fileNameProduct => fileNameProduct.filename)
        const objProduct = {
            ...req.body,
            mainProductImage: mainProductFile.filename,
            productsImage: productsFile,
        }
        const hanldeSaveProduct = async()=>{
            try{
                const productSave = new Product(objProduct)
                await productSave.save()
                return res.status(201).json({
                    message: "create product successfull"
                })
            }catch(err){
                console.log(err.message)
                return res.status(500).json({
                    message: "loi server"
                })
            }
        }
        hanldeSaveProduct()
    }

    //[patch]: /updateProducts
    updateProducts(req,res){
        res.send("update product page")
    }

    //[delete]: /delteProducts
    delteProducts(req,res){
        res.send("delte product page")
    }

}

module.exports = new ProductsController()
