/* eslint-disable */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
module.exports = function () {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // Configure axios for tests to use.
        const host = (_a = process.env.HOST) !== null && _a !== void 0 ? _a : 'localhost';
        const port = (_b = process.env.PORT) !== null && _b !== void 0 ? _b : '3000';
        axios.defaults.baseURL = `http://${host}:${port}`;
    });
};
