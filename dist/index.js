"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const port = 3000;
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.Name; // ensure case matches client
    const email = req.body.email;
    const phoneNum = req.body.phoneNum;
    const Github = req.body.Github;
    const elapsedTime = req.body.elapsedTime;
    const data = { "Name": name, "Email": email, "Phone": phoneNum, "Github": Github, "elapsedTime": elapsedTime };
    let existingData = [];
    try {
        try {
            const jsonData = yield fs.promises.readFile('db.json', 'utf8');
            existingData = JSON.parse(jsonData);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                console.error('db.json file is not found, creating db.json file...');
                yield fs.promises.writeFile('db.json', '[]', 'utf8');
                existingData = [];
            }
            else {
                console.error('Error reading existing data:', err);
                res.status(500).send({ message: 'Error accessing data storage!' });
                return;
            }
        }
        existingData.push(data);
        const newData = JSON.stringify(existingData, null, 2);
        yield fs.promises.writeFile('db.json', newData, 'utf8');
        res.send({ message: 'Data submitted successfully!' });
    }
    catch (err) {
        console.error('Error submitting data:', err);
        res.status(500).send({ message: 'Error submitting data!' });
    }
}));
app.get('/read', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jsonData = yield fs.promises.readFile('db.json', 'utf8');
        const submissions = JSON.parse(jsonData);
        const id = Number(req.query.id);
        if (id === -2) {
            //res.status(200).json(submissions.length);
            res.status(200).send(submissions.length.toString()); // Send the length as a string
            return;
        }
        else {
            if (!isNaN(id) && id >= 0 && id < submissions.length) {
                console.log(submissions[id]);
                res.status(200).json(submissions[id]);
            }
            else {
                res.status(500).send({ message: 'Index out of bound error' });
            }
            //res.send(JSON.parse(submissions[id]));
        }
        //res.status(200).json(submissions[id]);
    }
    catch (err) {
        console.error('Error retrieving submissions:', err);
        res.status(500).send({ message: 'Error retrieving submissions!' });
    }
}));
app.get('/ping', (req, res) => {
    res.send(true);
});
app.delete('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.query.id);
    try {
        const jsonData = yield fs.promises.readFile('db.json', 'utf8');
        const submissions = JSON.parse(jsonData);
        if (id === -2) {
            res.status(200).json(submissions.length);
        }
        else if (!isNaN(id) && id >= 0 && id < submissions.length) {
            submissions.splice(id, 1); // Remove the submission at the given index
            yield fs.promises.writeFile('db.json', JSON.stringify(submissions, null, 2), 'utf8');
            res.status(200).send({ message: 'Submission deleted successfully!' });
        }
        else {
            res.status(400).send({ message: 'Invalid submission ID!' });
        }
    }
    catch (err) {
        console.error('Error deleting submission:', err);
        res.status(500).send({ message: 'Error deleting submission!' });
    }
}));
app.put('/editAndSave', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.query.id);
    try {
        const jsonData = yield fs.promises.readFile('db.json', 'utf8');
        const submissions = JSON.parse(jsonData);
        if (!isNaN(id) && id >= 0 && id < submissions.length) {
            submissions[id] = req.body; // Update the submission at the given index
            yield fs.promises.writeFile('db.json', JSON.stringify(submissions, null, 2), 'utf8');
            res.status(200).send({ message: 'Submission updated successfully!' });
        }
        else {
            res.status(400).send({ message: 'Invalid submission ID!' });
        }
    }
    catch (err) {
        console.error('Error updating submission:', err);
        res.status(500).send({ message: 'Error updating submission!' });
    }
}));
app.get('/', (req, res) => {
    res.send("Slidely AI Task-2");
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
