//defining schema for how our documents in campsites collection will be structured//
const mongoose = require('mongoose');//  Mongoose library we downloaded//  //Mongoose is used for document structure//
const Schema = mongoose.Schema; //creates shorthand for mongoose.schema function so we can refer to it as "schema" instead of mongoose.schema//

//.loadType loads new currency type to mongoose  schemas to use//
require('mongoose-currency').loadType(mongoose);
const Currency =  mongoose.Types.Currency; //currency variable will be shorthand for this//


const commentSchema  = new Schema({
    rating: {
        type: Number, //if type is number, you can specify  min and max if you want//
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const campsiteSchema =  new Schema({//campsite schema we will eventually pass into a model's second parameter//
    name: {// require method forces you to have to use this property when you make an instance of this model later on, this is enforced by mongoose//
        type: String,
        required: true,
        unique: true 
    },
    description: { 
        type: String,
        required: true 
    },
    image:{
        type: String,
        required: true
    },
    elevation:{
        type: Number,
        required: true
    },
    cost:{
        type: Currency,
        required: true,
        min: 0
    },
    featured:{
        type: Boolean,
        default: false
    },
    comments: [commentSchema] // sub document( the schema defined above ) //
}, {//second optional argument for this schema//
    timestamps: true // this property causes mongoose to automatically add 'created at' and 'update at'//
});


//now will create a model using above schema//
const Campsite = mongoose.model('Campsite', campsiteSchema);  //first param singular capitalized  version of collection were targeting// mongoose automatically looks for the lower case plural version//


module.exports = Campsite;


/*
    schema first
    a  set of rules for data to meet in order to be passed into our collection(campsite) which is like an object

   const Campsite(campsite): {
       defined by campsiteSchema
       name: {
             'React Lake Campground'
       }
       description: {
           'test'
       }
    
*/

/*
    model second 
    the model takes the collection as first argument and schema as second. 
    when you make an instance of the model, it checks to see if schema requirements are met
    then if so, stores the values in the first parameter which contains collection name
*/

/* 
       SUB DOCUMENT
    we created another schema then stored it as an array in our campsiteSchema

*/