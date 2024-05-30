"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoutes = void 0;
const serviceRoutes = {
    getService: "/urubuto-store/:store_name",
    createService: "/service",
    deleteService: "/service/:id",
    updateService: "/service/:id",
    getServiceById: "/service/:id"
};
exports.serviceRoutes = serviceRoutes;
