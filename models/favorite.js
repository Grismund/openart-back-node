const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema  = new Schema(
    {
        // owner: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User',
        //     // type: String,
        //     required: true
        // },
        artworkId: {
            type: Number,
            required: true
        },
        folder: {
            type: String,
            default: "Favorites",
            required: true
        },
        userImage:{
            type: String,
            required: false
        },
        notes: {
            type: String,
            required: false
        },
        saved: {
            type: Boolean,
            default: false,
            required: true
        }
    }, {
    timestamps: true
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;