"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const port = 3000;
const app = (0, express_1.express)();
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
