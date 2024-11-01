import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool();

async function setupTable() {
    console.info("Setting up tables in database...");
    console.log("connecting to database...");

    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        console.log("Creating table...");

        const sqls = fs.readFileSync("tables.sql").toString().split(";");
        for (let i = 0; i < sqls.length; i++) {
            const sql = sqls[i].replace("\r", "").replace("\n", "");
            if (sql === "")
                continue;
            await client.query(sql);

        }
        console.log("Table setup completed.")
    } catch (ex) {
        console.log("Error setup postgres:", ex);
    } finally {
        if (client)
            client.release();
    }
}

export { pool, setupTable };
