var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, doc){
    var productRows = [];
    //var rowLength = 1; this is the number of items per row
    var rowLength = 4;
    for(var i = 0; i < doc.length; i += rowLength){
      productRows.push(doc.slice(i, i + rowLength));
    }
    res.render('shop/index', { title: 'Lux Shop', products : productRows });
  });
});

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product){
     if(err){
       return res.redirect('/');
       console.log('errore prodotto riga 26');
     }
     cart.add(product, product.id);
     req.session.cart = cart;
     console.log(req.session.cart);
     res.redirect('/');
  });
});

router.get('/shopping-cart', function(req, res, next) {
  if(!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
})

router.get('/checkout', function(req, res, next) {
  if(!req.session.cart) {
    return res.redirect('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', {total: cart.totalPrice})
})

module.exports = router;
