"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/replax';
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('MongoDB connected');
    }
    catch (error) {
        // In this development container we may not have MongoDB running.
        // Log the error and continue so the API can start for local frontend development.
        console.warn('MongoDB connection warning: could not connect. Continuing without DB in dev.');
        console.warn(String(error));
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map