import dns from "node:dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

// Windows workaround for nodejs/node#64428 (dup of #62347): Node's c-ares resolver
// can bind to 127.0.0.1 and fail SRV lookups (querySrv ECONNREFUSED) even when
// nslookup / Resolve-DnsName still work. Pin public resolvers before mongoose
// resolves the SRV record. NOTE: nodemon does not watch .env — restart the
// server (type `rs`) after switching MONGODB_URL or NODE_ENV there.
dns.setServers(["8.8.8.8", "1.1.1.1", "1.0.0.1"]);

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
           
        });
        console.log(" Connected to database");

        app.listen(PORT, () => {
            console.log(` App listening on port ${PORT}`);
        });
    } catch (err) {
        console.error(" Failed to connect to the database", err);
        process.exit(1);
    }
}

main();
