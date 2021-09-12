const express = require('express');
const promotionRouter = express.Router();
const authenticate = require('../authenticate');


const Promotion = require('../models/promotion');

promotionRouter.route('/')
.get((req, res,next) => {
  Promotion.find()
  .then(promotion => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotion); 
  })
  .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promotion.create(req.body)
  .then(promotion => {
    console.log('Promotion Created',promotion);
    res.statusCode = 200; 
    res.setHeader('Content-Type', 'application/json');
    res.json(promotion);
  })
  .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /partners');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promotion.deleteMany()
  .then(response => {
    res.statusCode =  200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response); 
  })
  .catch(err => next(err));
});

promotionRouter.route('/:promotionId')
.get((req, res, next) => {
  Promotion.findById(req.params.promotionId)//Whatever the user types in, this method will check the promotion collection to see if such an id is exist//
  .then(promotion => {
    res.statusCode =  200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotion); 
  })
  .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
  res.statusCode = 403;
  res.end(`Post operation not supported on /partners/${req.params.promotionId}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promotion.findByIdAndUpdate(req.params.promotionId,{ 
    $set: req.body
  }, { new: true})
  .then(promotion => {
    res.statusCode =  200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotion); 
  })
  .catch(err => next(err));
  })
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res,next) => {
 Promotion.findByIdAndDelete(req.params.promotionId)//first time we use this method anywhere //
 .then(response => {
  res.statusCode =  200;
  res.setHeader('Content-Type', 'application/json');
  res.json(response); 
})
.catch(err => next(err));
})

module.exports = promotionRouter;