import {web} from "./application/web.js";
import {logger} from "./application/logging.js";
import express from "express";
import path from "path";

const port = process.env.PORT || 8080;

web.use('/public', express.static(path.join(process.cwd(),'src', 'public')));
web.listen(port, () => {
    logger.info("App start");
});
