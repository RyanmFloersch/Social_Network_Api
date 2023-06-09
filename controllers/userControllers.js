const User = require('../models/User');
const Thought = require('../models/Thought');
const mongoose = require('mongoose');

module.exports = {
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    getSingleUser(req, res) {
        // Querying a user and selecting it based off passed in user id from url param.
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    //cretae a new user
    createUser(req, res) {
        // Create a new user using the data from the request's body
        User.create(req.body)
            //Return through json the new user
            .then((user) => res.json(user))
            // if there is an error return status 500 and the error
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
            });
    },
    // delete a user and remove from db
    deleteUser(req, res) {
        // Search for passed in user
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) =>
                !user
                    // If user not found by the id send message no use by that id. Else Delete all thoughts in this user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : Thought.deleteMany({ _id: { $in: user.thoughts } })

            )
            // Then send a message saying the user and associated thoughts where deleted and catch if any errors and send back a status 500 and the error. 
            .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
            });

    },
    updateUser(req, res){
        // Find a user from the passed in userId and update its properties using the content from 
        // the requests body.
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
        .then((user)=>{
            !user
                ? res.status(404).json({message: 'No user with this id'})
                : res.json(user);
        })
        .catch((err) =>{
            //Print err to terminal for easier debugging
            console.log(err);
            res.status(500).json(err)
        })


    },
    addFriend(req, res) {
        User.findOneAndUpdate(
            // Find a user with the passed in userId
            { _id: req.params.userId },
            // Add the user Id of the added friend to the array if not already there.
            { $addToSet: { friends: req.params.friendId } },
            // run validators and return a new 
            { runValidators: true, new: true }
        )
            .then((user) =>
                // If the user doesn't exist return with No user with this id else return with json of the user
                !user
                    ? res.status(404).json({ message: 'No user with this id' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
            });
    },
    removeFriend(req, res) {
        User.findOneAndUpdate(
            // Find a user with the passed in userId
            { _id: req.params.userId },
            // Removes a user from the friends property array with the passed in friendId
            { $pull: { friends:  req.params.friendId  } },
            // run validators and return a new 
            { runValidators: true, new: true }
        )
            .then((user) =>
            !user
                ? res.status(400).json('No user with this id')
                : res.json(user) 
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
            });
    }



};
