const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//User Model
const User = require("../../models/User");
const Board = require('../../models/Board');

const auth = require('../../middleware/auth');

// @route POST api/users
// @desc Get user boards
// @access Private
router.get('/boards', auth, async (req, res) => {
    try {
        const { boards } = await
            (
                await User
                    .findById(req.user.id)
            )
                .populate('boards', 'id title type background')
                .execPopulate();
        res.json({ boards });
        // if (!user) return res.status(404).json({ msg: 'User not found' });
        // const { boards } = await user;
    }
    catch (error) {
        console.log("Error caught by self logging in try-catch:", error);
        res.status(500).json({ msg: 'An unexpected error occurred. Please try again later' });
    }
});

// @route POST api/users
// @desc Create a user
// @access Public
router.post("/", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
        return res.status(400).json({ msg: "Kindly fill all the required fields" });
    }

    const newUser = new User({
        name, email, password
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser.save()
                .then(user => {

                    jwt.sign(
                        { id: user.id }, //payload {}
                        config.get('jwtSecret'), //api key module, handles all api keys
                        { expiresIn: 3600 }, //options {}
                        (err, token) => { //callback
                            if (err) throw err;
                            res.json({
                                user: {
                                    id: user.id,
                                    name: user.name
                                },
                                token
                            })
                        }
                    )
                })
                .catch(({ errors }) => {
                    const msgs = [];
                    for (key in errors) {
                        msgs.push(errors[key].message)
                    }
                    res.status(400).json({ msg: msgs });
                });
        });
    });
});

module.exports = router;
