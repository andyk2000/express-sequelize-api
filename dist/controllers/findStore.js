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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStore = void 0;
const Stores_1 = require("../models/Stores");
const findStore = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const allStores = yield (0, Stores_1.getStores)();
    const storeNames = allStores.map(store => store.name);
    console.log(storeNames);
    return 0;
    // allStores.map(store => () => {
    //     const slug = slugify(store.name, {lower: true, strict: true,});
    //     if(slug === name){
    //         console.log(store.id);
    //         return store.id;
    //     }
    // })
});
exports.findStore = findStore;
