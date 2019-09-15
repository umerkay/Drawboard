const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const Board = require('../../models/Board');
const User = require('../../models/User');

// router.get('/lol', (req, res) => {
//     res.json({ token: authorizeBoard({ lol: false }) });
// });
// @route POST api/boards
// @desc Create a board with authorised token
// @access Private
router.post('/', auth, async (req, res) => {

    try {
        const { title, password, type, background } = req.body;

        if (!type) return res.status(400).json({ msg: "The board type { Public, Password } was not specified" });
        if (!title || title.length === 0) return res.status(400).json({ msg: "The board title was not specified" });
        if (type === 'Password' && (!password || password.length === 0)) return res.status(400).json({ msg: 'The specified type Password required a password' })
        if (title.length > 50) return res.status(400).json({ msg: 'The board name should not be longer than 50 characters' });

        const newBoard = new Board({
            title,
            password,
            owner: req.user.id,
            type,
            background
        });

        const board = await newBoard.save();

        let user = await User.findById(board.owner);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.boards.push(mongoose.Types.ObjectId(board.id));
        user.save({ validateBeforeSave: false }); //not waiting because not necessary

        user = await user.populate('boards').execPopulate();

        res.json({
            board: {
                _id: board.id,
                title: board.title,
                type: board.type,
                background: board.background
            },
            boards: user.boards.map(board => ({ _id: board.id, background: board.background, title: board.title, type: board.type }))
        });
    } catch (err) {
        notOk(err, res);
    }

});

router.post('/anonymous', async (req, res) => {

    try {
        const { title, password, type, background } = req.body;
        if (!type) return res.status(400).json({ msg: "The board type { Public, Password } was not specified" });
        if (!title || title.length === 0) return res.status(400).json({ msg: "The board title was not specified" });
        if (type === 'Password' && (!password || password.length === 0)) return res.status(400).json({ msg: 'The specified type Password required a password' })
        if (title.length > 50) return res.status(400).json({ msg: 'The board name should not be longer than 50 characters' });

        const newBoard = new Board({
            title,
            password,
            type,
            background
        });

        const board = await newBoard.save();
        res.json({ board });
    } catch (err) {
        notOk(err, res);
    }

});

// @route DELETE api/boards
// @desc Delete a board
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) res.json({ msg: 'The requested board was not found' });

        if (board.owner === req.user.id) {

            let user = await User.findById(board.owner);
            if (!user) return res.status(404).json({ msg: 'User not found' });

            user.boards = user.boards.filter(id => id != board.id);
            await user.save({ validateBeforeSave: false });

            user = await user.populate('boards').execPopulate();

            await board.remove();

            res.json({
                msg: 'Board deleted',
                boards: user.boards.map(board => ({
                    _id: board.id,
                    title: board.title,
                    type: board.type,
                    background: board.background
                }))
            });

        } else {
            res.status(401).json({ msg: 'The board requested for removal is not owned by you' });
        }
    } catch (err) {
        res.status(404).json({ msg: 'The requested board was not found or some other error occured' });
    }
});

router.get('/:id',
    async (req, res, next) => {
        let board;
        try {
            board = await Board.findById(req.params.id);
        } catch (err) { return res.status(400).json({ msg: 'The ID provided for the board is not valid' }) }  //bad request
        if (!board) return res.status(404).json({ msg: 'The requested board was not found' }); //not found

        let { id, title, type, owner, paths } = board;

        if (board.type === 'Public') {
            authorizeBoard(res, board);
        } else if (board.type === 'Password') {
            if (req.header('x-auth-token') !== 'null') {
                req.board = board;
                next();
            } else notAuthorizeBoard(res, board, 'This Drawboard is protected by a password')
        }
    }, auth,
    async (req, res) => {
        try {
            if (req.user.id == req.board.owner) authorizeBoard(res, req.board, { role: 'OWNER' });
            else notAuthorizeBoard(res, req.board, 'This Drawboard is protected by a password');
        }
        catch (err) {
            notOk(err, res);
        }
    });

router.post('/auth/:id', async (req, res, next) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ msg: 'The requested board was not found' });

        if (board.password === req.body.password) authorizeBoard(res, board);
        else notAuthorizeBoard(res, board, 'The password provided was not correct');
    }
    catch (err) {
        notOk(err, res);
    }
});

function authorizeBoard(res, { id, title, type, owner, paths, background }, payload = {}) {
    const role = payload.role || 'EDIT';
    const token = jwt.sign(
        { id, role, ...payload },
        config.get('jwtSecret'), //api key from key handling module
        {}, //options {}
    );
    res.json({ board: { id, title, type, owner, paths, background, isAuthenticated: true, role }, token });
}

async function notAuthorizeBoard(res, { id, title, type, owner }, msg = 'Could not authorize access to board') {
    owner = await User.findById(owner);
    res.status(401).json({
        msg,
        board: { title, type, owner: owner && owner.name, id, isAuthenticated: false }
    });
}

function notOk(err, res) {
    console.log(err);
    res.status(500).json({ msg: "The request could not be processed. Please try again later", err });
}

module.exports = router;