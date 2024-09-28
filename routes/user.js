var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelper = require('../helpers/user-helpers')

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
  res.render('user/signup.hbs')
})

router.post('/signup', (req, res)=>{
  userHelper.doSignUp(req.body).then((response)=>{
    console.log(response)
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

module.exports = router;
