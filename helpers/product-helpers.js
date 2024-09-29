var db = require('../config/connection')
var collection = require('../config/collections')
var ObjectId = require('mongodb').ObjectId;

module.exports = {
    addProduct: (product, callback) => {
        db.getDb().collection('product').insertOne(product).then((data) => {
            callback(data.insertedId.toString())
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.getDb().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct: (productId) => {
        return new Promise((resolve, reject) => {
            db.getDb().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: new ObjectId(productId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getProductDetails: (productId) => {
        return new Promise((resolve, reject) => {
            db.getDb().collection(collection.PRODUCT_COLLECTION).findOne({ _id: new ObjectId(productId) }).then((product) => {
                resolve(product)
            })
        })
    },
    updateProduct: (productId, productDetails) => {
        return new Promise((resolve, reject) => {
            db.getDb().collection(collection.PRODUCT_COLLECTION)
                .updateOne({ _id: new ObjectId(productId) }, {
                    $set: {
                        name: productDetails.name,
                        category: productDetails.category,
                        price: productDetails.price,
                        description: productDetails.description
                    }
                }).then((response) => {
                    resolve()
                })
        })
    }
}