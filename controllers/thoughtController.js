const thought = require('../models/thought');
const user = require('../models/user');

module.exports = {
    getThoughts(req, res){
        thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err))
    },
    getThought(req, res){
        thought.findOne({_id: req.params.thoughtId})
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({message: 'no thought w that id.'})
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    createThought(req, res){
        thought.create(req.body)
            .then((thought) => {
                return user.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: {thoughts: thought._id} },
                    { new: true }
                );
            })
            .then((user) =>
                !user
                    ? res.status(400).json({ message: 'thought created, but found no user w that id.' })
                    : res.json('thought created, and thought pushed to assoc user\'s thoughts array.')
            )
            .catch((err) => res.status(500).json(err));
    },
    updateThought(req, res){
        thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'no thought w that id.' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res){
        thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'no thought w that id.' })
                    : user.findOneAndUpdate(
                        { thoughts: req.params.thoughtId },
                        { $pull: { thoughts: req.params.thoughtId } },
                        { new: true }
                    )
            )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'thought created, but no user w this id.' })
                    : res.json({ message: 'thought successfully deleted and pulled from assoc user.' })
            )
            .catch((err) => res.status(500).json(err));
    },
    addReaction(req, res){
        thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'no thought w that id.' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    removeReaction(req, res){
        thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'no thought w that id.' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    }
};