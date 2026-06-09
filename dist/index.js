"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
// Endpoint to create a user
app.post('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, age, email } = req.body;
    const newUser = new db_1.User({ name, age, email });
    try {
        const savedUser = yield newUser.save();
        res.status(201).send({ message: 'User created', user: savedUser });
    }
    catch (err) {
        res.status(500).send({ message: 'Error creating user', error: err });
    }
}));
// Endpoint to fetch all users
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.User.find();
        res.status(200).send(users);
    }
    catch (err) {
        res.status(500).send({ message: 'Error fetching users', error: err });
    }
}));
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
