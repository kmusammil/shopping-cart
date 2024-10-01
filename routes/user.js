var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelper = require('../helpers/user-helpers');
const { Db } = require('mongodb');
const verifyLogin=(req, res, next)=>{
  if(req.session.userLoggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let user= req.session.user;
  productHelper.getAllProducts().then((products) => {
    res.render('user/view-products', {admin: false, products, user})
  })
});
router.get('/login', (req, res)=>{
  if (req.session.userLoggedIn){
    res.redirect('/')
  }else{
    res.render('user/login', {loginErr:req.session.loginErr})
    req.session.loginErr= false
  }
})
router.get('/signup', (req, res)=>{
  res.render('user/signup')
})

router.post('/signup', (req, res)=>{
  userHelper.doSignUp(req.body).then((response)=>{
    req.session.userLoggedIn=true;
    req.session.user= response
    res.redirect('/')
  })
})
router.post('/login', (req, res)=>{
  userHelper.doLogIn(req.body).then((response)=>{
    if (response.status){
      req.session.userLoggedIn = true;
      req.session.user = response.user;
      res.redirect('/')
    }else{
      req.session.loginErr= 'Invalid username or password';
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req,res)=>{
  req.session.destroy();
  res.redirect('/')
})

router.get('/cart', verifyLogin, async(req, res)=>{
  let products =await userHelper.getCartProducts(req.session._id)
  console.log(products)
  res.render('user/cart', {products})
})

router.get('/add-to-cart/:id', verifyLogin, (req, res)=>{
  userHelper.addToCart(req.params.id, req.session.user._id).then((response)=>{
    res.redirect('/')
  })
})



module.exports = router;
