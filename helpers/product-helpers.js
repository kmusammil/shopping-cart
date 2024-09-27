var db = require('../config/connection')
var collection = require('../config/collections')

module.exports={
    addProduct:(product, callback)=>{
        db.getDb().collection('product').insertOne(product).then((data)=>{           
            callback(data.insertedId.toString())
        })
    }, 
    getAllProducts:()=>{
        return new Promise(async (resolve, reject)=>{
            let products = await db.getDb().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    }
}