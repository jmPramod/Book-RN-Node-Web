

import { app, runServer } from "./app"
import dotenv from "dotenv"
dotenv.config()
const port=process.env.PORT 

runServer()
app.listen(port,()=>{

    console.log(`Server is running on port http://localhost:${port}/`);
    
})