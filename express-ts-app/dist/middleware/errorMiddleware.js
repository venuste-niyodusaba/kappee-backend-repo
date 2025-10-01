"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const notFound = (_req, res, _next) => {
    res.status(404).json({ message: "Not Found" });
};
exports.notFound = notFound;
const errorHandler = (err, _req, res, _next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Server Error" });
};
exports.errorHandler = errorHandler;
