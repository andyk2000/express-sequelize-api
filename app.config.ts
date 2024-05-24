import { Pool } from "pg"

const db = new Pool({
    user: "postgres",
    host: 'localhost',
    database: "merchant-service",
    password: "Ny@bibuye30",
    port: 5432
});

export {
    db,
}