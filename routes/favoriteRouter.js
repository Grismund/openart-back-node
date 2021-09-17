const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const favoriteRouter = express.Router();

favoriteRouter.route('/', authenticate.verifyUser)

.get((req, res, next) => {
    // Favorite.find(Favorite.owner = req.user)


    // Favorite.find(function() {
    //     if (Favorite.owner = req.user) {
    //         return(Favorite)
    //     }
    // }) 


    Favorite.find()
    .populate('favorites.owner')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})

// .post(authenticate.verifyUser, (req, res, next) => {
//     Favorite.findById(req.params.favoriteId)
//     .then(favorites => {
//       if(favorites){
//           req.body.author = req.user._id;
//           favorites.notes.push(req.body);
//           favorites.save()
//           .then(favorites => {
//               res.statusCode = 200;
//               res.setHeader('Content-Type', 'application/json');
//               res.json(favorites);
//           })
//           .catch(err => next());
//       } else {
//         err = new Error(`Favorites ${req.params.favoriteId} not found`);
//         err.statusCode = 404;
//         return next(err);
//       }
//     })


// working but inadequate
.post(authenticate.verifyUser, (req, res, next) => {
    Favorite.create(req.body)
    .then(favorites => {
        console.log('Favorite Created', Favorite);
        res.statusCode = 200; //means success //
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})

.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Favorite.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// Put method for updating notes
// .put(authenticate.verifyUser, (req, res, next) => {
//     Favorite.findByIdAndUpdate(req.params.,{ 
//       $set: req.body
//     }, { new: true})
//     .then(partner => {
//       res.statusCode =  200;
//       res.setHeader('Content-Type', 'application/json');
//       res.json(partner); 
//     })
    
module.exports = favoriteRouter;