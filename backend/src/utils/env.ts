import type { EnvTypes } from "./types.ts"
import { config } from "dotenv"
config()

const env: EnvTypes = {
    PORT: Number(process.env.PORT)||8080
}
export default env