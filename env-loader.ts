import { loadEnvConfig } from "@next/env";
import path from "path";

const dir = path.join(__dirname);
loadEnvConfig(dir);

console.log(dir);
