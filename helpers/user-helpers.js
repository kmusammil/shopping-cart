var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
var ObjectId = require('mongodb').ObjectId;

module.exports={
    doSignUp:(userData)=>{
        return new Promise(async(resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.getDb().collection(collection.USER_COLLECTION).insertOne(userData).then(()=>{
                resolve(userData)
            })
        })
    },
    doLogIn:(userData)=>{
        return new Promise(async(resolve, reject) => {
            let user=await db.getDb().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status)=>{
                    if(status){
                        response.user = user;
                        response.status = true;
                        resolve(response)
                        console.log('login succes');
                    }else{
                        console.log('login failed');
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login failed - incorrect username'); 
                resolve({status:false})
            }
        })
    },
    addToCart:(productId, userId)=>{
        return new Promise(async(resolve, reject)=>{
            let userCart = await db.getDb().collection(collection.CART_COLLECTION).findOne({user: new ObjectId(userId)})
            if(userCart){
                db.getDb().collection(collection.CART_COLLECTION)
                .updateOne({user: new ObjectId(userId)},
                {
                    $push:{products: new ObjectId(productId)}
                }
            ).then((response)=>{
                resolve()
            })
            }else{
                let cartObj = {
                    user: new ObjectId(userId),
                    products: [new ObjectId(productId)]
                }
                db.getDb().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve, reject)=>{
            let cartItems= await db.getDb().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user: new ObjectId(userId)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        let:{productList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id', "$$productList"]
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            console.log('result: ' + cartItems)
            resolve(cartItems)
        })
    }
}