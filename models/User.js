const { Schema, model } = require('mongoose');



// Email regex
// /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
        required: true,
    },
    // Array of _id values referencing the Thought model
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought',
        },

    ],
    // Arryan of _id values referencing the user model
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

// Creates a virtual property friends that gets the amount of friends per user.
//virtual property for total number of friends in friends array. 
userSchema
    .virtual('friendCount')
    // Getter
    .get(function () {
        return this.friends.length;
    });


const User = model('user', userSchema);

module.exports = User;
