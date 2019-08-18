const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

//User Model
const User = require("../../models/User");

// @route POST api/auth
// @desc Authenticate the user
// @access Public
router.post("/", (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ msg: "Kindly fill all the required fields" });
    }

    User.findOne({ name }).then(user => {
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.compare(password, user.password) //validate password
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

                    jwt.sign(
                        { id: user.id }, //payload {}
                        config.get('jwtSecret'), //api key from key handling module
                        {}, //options {}
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
                });
        });
    });
});

// @route POST api/auth/user
// @desc Get user data
// @access Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id).select('-password').then(user => {
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json({ user });
    });
});

module.exports = router;
