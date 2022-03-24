const user = require('../models/user');

module.exports = {
    getUsers(req, res){
        user.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    getUser(req, res){
        user.findOne({_id: req.params.userId})
            .select('-__v') //excludes version
            .then((user) =>
                !user
                    ? res.status(404).json({message: 'no user w that id.'})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    createUser(req, res){
        user.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res){
        user.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
            .then((user) => 
                !user
                    ? res.status(404).json({message: 'no user w this id.'})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res){
        user.findOneAndDelete({_id: req.params.userId})
            .then((user) =>
                !user
                    ? res.status(404).json({message: 'no user w that id.'})
                    : thought.deleteMany({_id: {$in: user.thoughts}})
            )
            .then(() => res.json({message: 'user and associated thoughts deleted.'}))
            .catch((err) => res.status(500).json(err));
    },
    addFriend(req, res){
        // console.log(req.body);
        user.findOneAndUpdate(
            {_id: req.params.userId},
            {$addToSet: {friends: req.body}},
            {runValidators: true, new: true}
        )
            .then((user) =>
                !user
                    ? res.status(404).json({message: 'no user found w this id.'})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    removeFriend(req, res){
        user.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friend: {friendId: req.params.friendId}}},
            {runValidators: true, new: true}
        )
            .then((user) =>
                !user
                    ? res.status(404).json({message: 'no user w that id.'})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    }
};