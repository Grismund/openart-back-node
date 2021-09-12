// const { response } = require('express');
const express = require('express');
const Campsite = require('../models/campsite');//now we have access to campsite.js file which has our campsite/comment schema, now were able to create an instance of the model in that file //
const authenticate = require('../authenticate');
//This router handles the GET, PUT, POST, and delete http methods for any  path that begins with /campsites, including route parameters /:campsiteId //

const campsiteRouter = express.Router();



campsiteRouter.route('/')
.get((req, res, next) => {
    Campsite.find()
    .populate('comments.author')
    .then(campsites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsites);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Campsite.create(req.body)//all the required fields from the schema have to met and will pass that data from client making sure all fields are met //
  .then(campsite => {//if client successfully meets all  fields this returns what they input and we console.log it  //
    console.log('Campsite Created',campsite);
    res.statusCode = 200; //means success //
    res.setHeader('Content-Type', 'application/json');
    res.json(campsite);
  })
  .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /campsites');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Campsite.deleteMany()// every doc in campsite collection deleted //
  .then(response => {// deleteMany method's result is information about how many documents were deleted //
    res.statusCode =  200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response); // this gets sent back to client and it holds info abt how many docs were deleted in the collection //
  })
  .catch(err => next(err));
});



campsiteRouter.route('/:campsiteId')
.get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
  res.statusCode = 403;
  res.end(`Post operation not supported on /campsites/${req.params.campsiteId}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Campsite.findByIdAndUpdate(req.params.campsiteId,{ 
    $set: req.body
  }, { new: true})
  .then(campsite => {
    res.statusCode =  200;
    res.setHeader('Content-Type', 'application/json');
    res.json(campsite); 
  })
  .catch(err => next(err));
  })
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res,next) => {
  Campsite.findByIdAndDelete(req.params.campsiteId)//first time we use this method anywhere //
  .then(response => {
  res.statusCode =  200;
  res.setHeader('Content-Type', 'application/json');
  res.json(response); 
})
.catch(err => next(err));
})





campsiteRouter.route('/:campsiteId/comments')
.get((req, res, next) => {
  Campsite.findById(req.params.campsiteId)
  .populate('comments.author')
  .then(campsite => {
    if(campsite){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite.comments);
    } else {
      err = new Error(`Campsite ${req.params.campsiteId} not found`);
      err.statusCode = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
  Campsite.findById(req.params.campsiteId)
  .then(campsite => {
    if(campsite){
        req.body.author = req.user._id;
        campsite.comments.push(req.body);
        campsite.save()
        .then(campsite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite);
        })
        .catch(err => next());
    } else {
      err = new Error(`Campsite ${req.params.campsiteId} not found`);
      err.statusCode = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
  res.statusCode = 403;
  res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`);
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Campsite.findById(req.params.campsiteId)
  .then(campsite => {
    if(campsite){
        for(let i =  (campsite.comments.length-1); i >= 0; i--){
          campsite.comments.id(campsite.comments[i]._id).remove();
        }
        campsite.save()
        .then(campsite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite);
        })
        .catch(err => next());
    } else {
      err = new Error(`Campsite ${req.params.campsiteId} not found`);
      err.statusCode = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
});




campsiteRouter.route('/:campsiteId/comments/:commentId')//created a new path  just for sub document//
.get((req, res, next) => {
  Campsite.findById(req.params.campsiteId)
  .populate('comments.author')
  .then(campsite => {
    if(campsite && campsite.comments.id(req.params.commentId)){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite.comments.id(req.params.commentId));
      } else if (!campsite){
        err = new Error(`Campsite ${req.params.campsiteId} not found`);
        err.statusCode = 404;
        return next(err);
    } else {
      err = new Error(`Comment ${req.params.commentId} not found`);
      err.statusCode = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
  res.statusCode =  403;
  res.end(`POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`)
})
.put(authenticate.verifyUser, (req, res, next) => {
  Campsite.findById(req.params.campsiteId)
  .then(campsite => {
    if(campsite && campsite.comments.id(req.params.commentId)){

//find the req.user.id = author of comment or not.
        if(campsite.comments.id(req.params.commentId).author._id.equals(req.user._id)) {
 
        if(req.body.rating){//rating property passed from client body//
          campsite.comments.id(req.params.commentId).rating = req.body.rating;//rating in comment schema but value for this property comes from client body//
        }
        if(req.body.text){//separate if statements so they both will get checked//
          campsite.comments.id(req.params.commentId).text = req.body.text;//text in comment schema but value for this property comes from client body //
        }
        campsite.save()//this saves data received from client to mongodb database//
        .then(campsite =>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');//is convention to specify type of data being sent//
          res.json(campsite);
        })
        .catch(err => next(err));
      } else {
        err = new Error("You are not authorized to update this comment");
        err.status = 403;
        return next(err);
      }
      } else if (!campsite){
        err = new Error(`Campsite ${req.params.campsiteId} not found`);
        err.statusCode = 404;
        return next(err);
    } else {
      err = new Error(`Comment ${req.params.commentId} not found`);
      err.statusCode = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Campsite.findById(req.params.campsiteId)
  .then(campsite => {

        

          if(campsite && campsite.comments.id(req.params.commentId)){

            if(campsite.comments.id(req.params.commentId).author._id.equals(req.user._id)) {

          campsite.comments.id(req.params.commentId).remove();
        campsite.save()
        .then(campsite =>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');//is convention to specify type of data being sent//
          res.json(campsite);
        })
        .catch(err => next(err));
      } else {
        err = new Error("You are not authorized to update this comment");
        err.status = 403;
        return next(err);
      }
      } else if (!campsite){
        err = new Error(`Campsite ${req.params.campsiteId} not found`);
        err.statusCode = 404;
        return next(err);
    } else {
      err = new Error(`Comment ${req.params.commentId} not found`);
      err.statusCode = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
});

module.exports = campsiteRouter;