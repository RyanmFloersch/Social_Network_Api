const Thought = require('../models/Thought');
const User = require('../models/User');
const Reaction = require('../models/Reaction')


module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne(
            { _id: req.params.thoughtId }
        )
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    createThought(req, res) {
        //Create a thought through the requests body data
        Thought.create(req.body)
            // Return the user found by the userId passed through the request body.
            .then((thought) => {
                // Find the user associated with the id and add to their thoughts array the newly created throught 
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thought._id } },
                    { new: true }
                );
            })
            // Check if the user the thought was added to was found or not.
            .then((user) =>
                !user
                    // If the user was not found return this error and message
                    ? res.status(404).json({
                        message: 'Thought created, but found no user by that id'
                    })
                    // If it was found return this message
                    : res.json('Created the thought')
            )
            .catch((err) => {
                console.log(err);
                // If there is an error return status 500 and the error through json
                res.status(500).json(err);
            });

    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) => {
                !thought
                    ? res.status(404).json({ message: 'No thought with this id' })
                    : res.json(thought);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)

            }
            )
    },
    deleteThought(req, res) {

        // If the thought isn't found return an error 
        // else look for the user associated to the thought and upade the thoughts array for the user  
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id' })
                    : User.findOneAndUpdate(
                        { thoughts: req.params.thoughtId },
                        { $pull: { thoughts: req.params.thoughtId } },
                        { new: true }
                    )
            )
            .then((user) =>
                // Cehck if the user exists 
                !user
                    ? res.status(404).json({ message: 'Thought delete but no user with this id' })
                    : res.json({ message: 'Thought successfully deleted' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
            })
    },
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.staus(404).json({ message: 'No thought with this' })
                    : res.json(thought)
            )
            .catch((err) =>
                res.status(500).json(err)
            )
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id' })
                    : res.json(thought)
            )
            .catch((err) =>
                res.status(500).json(err)
            )
    }


};

