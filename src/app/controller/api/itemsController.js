const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const stateItemOfHome = {
    items: [
    ],
    setItems(data){
        this.items = data;
    }
}

class itemsController{
    //[get]: /allItem
    home(req,res){
        res.send('all item page')
    }

    //[post]: /createItems
    createItems(req,res){
        res.send("create item page")
    }

    //[patch]: /updateItems
    updateItems(req,res){
        res.send("update item page")
    }

    //[delete]: /delteItems
    delteItems(req,res){
        res.send("delte item page")
    }

}

module.exports = new itemsController()
