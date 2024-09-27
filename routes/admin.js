var express = require('express');
const { log } = require('handlebars');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function (req, res, next) {

  productHelper.getAllProducts().then((products) => {
    res.render('admin/view-products', {admin: true, products})
  })
})

router.get('/add-product', (req, res) => {
  res.render('admin/add-product')
})

router.post('/add-product', (req, res) => {
  productHelper.addProduct(req.body, (id) => {
    let image = req.files.image
    image.mv('./public/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render('admin/add-product')
      } else {
        console.log(err);
      }
    })
  })
})

module.exports = router;
