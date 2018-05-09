const express = require("./config/express");
const app = express();

const server = app.listen(3000, "localhost", () => {
    const port = server.address().port;
    const hostname = server.address().address;
    console.log(`Server running at ${hostname}:${port}`);
})