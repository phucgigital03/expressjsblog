const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const Product = require('../../model/Product')
const Inventory = require('../../model/Inventory')
const mongooseObj = require('../../../util/mongoose')

class ProductsController{
    //[get]: /allProduct
    home(req,res,next){
        const getAllProduct = async()=>{
            try{
                const allProduct = await Product.find({})
                res.render("products/allProduct.hbs",{
                    allProduct: mongooseObj.mutipleObj(allProduct)
                })
            }catch(err){
                next(err)
            }
        }
        getAllProduct()
    }

    //[get]: /formCreatePro
    formCreatePro(req,res,next){
        return res.status(201).json({
            htmlCreateProduct: `
            <form id="form-createPro" enctype="multipart/form-data" method="POST">
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="inputName">nameProduct</label>
                        <input type="text" name="nameProduct" class="form-control" id="inputName" placeholder="enter name product">
                    </div>
                    <div class="form-group col-md-6">
                        <label for="inputdescription">Description</label>
                        <input type="text" name="description" class="form-control" id="inputdescription" placeholder="Description">
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputGender">Gender</label>
                    <input type="text" name="gender" class="form-control" id="inputGender" placeholder="gender">
                </div>
                <div class="form-group">
                    <label for="inputgroupId">groupId</label>
                    <input type="text" name="groupId" class="form-control" id="inputgroupId" placeholder="groupId">
                </div>
                <div class="form-group">
                    <label for="inputstatus">status</label>
                    <input type="text" name="status" class="form-control" id="inputstatus" placeholder="status">
                </div>
                <div class="form-group">
                    <label for="inputprice">price</label>
                    <input type="text" name="price" class="form-control" id="inputprice" placeholder="price">
                </div>
                    <div class="form-group">
                    <label for="inputdiscount">discount</label>
                    <input type="text" name="discount" class="form-control" id="inputdiscount" placeholder="discount">
                </div>
                <div class="form-group">
                <label for="inputcountInstock">countInstock</label>
                <input type="text" name="countInstock" class="form-control" id="inputcountInstock" placeholder="countInstock">
                </div>
                <div class="form-check">
                <p>size</p>
                    <div>
                        <input class="form-check-input size-pro" name="size" type="radio" value="m" id="size">
                        <label class="form-check-label" for="size">
                            m
                        </label>
                    </div>
                    <div>
                        <input class="form-check-input size-pro" name="size" type="radio" value="l" id="size">
                    <label class="form-check-label" for="size">
                        l
                    </label>
                </div>
                <div>
                    <input class="form-check-input size-pro" name="size" type="radio" value="xl" id="size">
                    <label class="form-check-label" for="size">
                        xl
                    </label>
                </div>
                </div>
                <div class="form-check">
                <p>color</p>
                <div>
                    <input class="form-check-input color-pro" name="color" type="radio" value="white" id="color">
                    <label class="form-check-label" for="color">
                        white
                    </label>
                </div>
                <div>
                    <input class="form-check-input color-pro" name="color" type="radio" value="black" id="color">
                    <label class="form-check-label" for="color">
                        black
                    </label>
                </div>
                <div>
                    <input class="form-check-input color-pro" name="color" type="radio" value="pink" id="color">
                    <label class="form-check-label" for="color">
                        pink
                    </label>
                </div>
                </div>
                <div class="productsImage">
                    <label for="productsImage">productsImage</label>
                    <input type="file" id="file" name="productsImage" multiple required/>
                </div>
                <div class="mainProductImage">
                    <label for="mainProductImage">mainProductImage</label>
                    <input type="file" id="file" name="mainProductImage" required/>
                </div>
                <button type="submit" class="btn btn-primary">create Product</button>
            </form>
            `
        })
    }

    //[post]: /createPro
    createPro(req,res,next){
        const fileNameProducts = req.files['productsImage']
        const mainProductFile = req.files['mainProductImage'][0]
        const productsFile = fileNameProducts.map(fileNameProduct => fileNameProduct.filename)
        if(!req.body.color){
            req.body.color = '';
        }
        if(!req.body.size){
            req.body.size = '';
        }
        const pricePro = {
            price: Number(req.body.price),
            discount: Number(req.body.discount)
        }
        delete req.body.price
        delete req.body.discount

        const objProduct = {
            ...req.body,
            mainProductImage: mainProductFile.filename,
            productsImage: productsFile,
            pricePro
        }
        const hanldeSaveProduct = async()=>{
            try{
                const productConstructer = new Product(objProduct)
                const productSaved = await productConstructer.save()
                const inventory = new Inventory({
                    productId: productSaved._id,
                    quatity: productSaved.countInstock,
                    reservations: []
                })
                await inventory.save()
                return res.status(201).json({
                    message: 'successfull',
                    url: 'http://localhost:5500/products/allItem'
                })
            }catch(err){
                next(err)
            }
        }
        hanldeSaveProduct()
    }

    //[patch]: /updateProducts
    updateProducts(req,res,next){
        return res.send("update product page")
    }

    //[delete]: /deleteProducts
    delteProducts(req,res,next){
        return res.send("delte product page")
    }

}

module.exports = new ProductsController()
