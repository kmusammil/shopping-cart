var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')

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
    }
}