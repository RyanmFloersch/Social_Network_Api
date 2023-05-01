const Thought = require('../models/Thought');
const User = require('../models/User');


module.export = {
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne(
            { _id: body.params.thoughtId }
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
    updateThought(req,res){
        
    }


}

