"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const outputFile = "./src/swagger-output.json"; // where to save
const endpointsFiles = ["./src/index.ts"];
const doc = {
    info: {
        title: "My API",
        description: "API documentation",
    },
    host: "localhost:3000",
    schemes: ["http"],
};
(0, swagger_autogen_1.default)()(outputFile, endpointsFiles, doc);
