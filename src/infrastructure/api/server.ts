import dotenv from "dotenv";
import { app, setupDb } from "./express";

dotenv.config();
const port: number = Number(process.env.PORT) || 3000;

app.listen(port, async () => {
    await setupDb();
    console.log(`Server is listening on port ${port}`);
});