var express = require('express');
const { log } = require('handlebars');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function (req, res, next) {

  productHelper.getAllProducts().then((products) => {
    res.render('admin/view-products', { admin: true, products })
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

router.get('/delete-product/:id', (req, res) => {
  productId = req.params.id;
  productHelper.deleteProduct(productId).then((response) => {
    res.redirect('/admin/')
  })
})
router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelper.getProductDetails(req.params.id)
  res.render('admin/edit-product', { product })
})

router.post('/edit-product/:id', (req, res) => {
  productHelper.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin/')
    let image = req.files.image
    image.mv('./public/product-images/' + req.params.id + '.jpg')
  })
})
module.exports = router;
