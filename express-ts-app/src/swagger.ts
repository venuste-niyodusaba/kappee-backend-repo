import swaggerAutogen from "swagger-autogen";

const outputFile = "./src/swagger-output.json"; // where to save
const endpointsFiles = ["./src/index.ts"]; 

const doc = {
  info: {
    title: "kappe API",
    description: " kapee backend API documentation",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

swaggerAutogen()(outputFile, endpointsFiles, doc);
