import dotenv from 'dotenv'
import path from 'path'
dotenv.config({path: path.resolve(__dirname, '../.env')})

export const port = 3000
export const bodyLimit = "100kb"
export const corsHeaders = ["Link"]
export const apiVersion = "v1"