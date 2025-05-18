import express from "express"
import cookieParser from 'cookie-parser';
import cors from "cors"
import helmet  from "helmet";
import morgan from "morgan"
import hbs, { engine } from "express-handlebars"
import flash from 'connect-flash';
// import swaggerUI from "swagger-ui-express"
import "dotenv/config";
import { adminRoutesMono } from "./routes/monoArchiRoute/auth.mono.routes";
import { authRoutesRest } from "./routes/restRoutes/auth.rest.routes";
import { connectMongooseDB } from "./config/db.connect";
import { bookRoutesRest } from "./routes/restRoutes/book.rest.routes";
import { ErrorHandelingMiddlewear } from "./middlewear/global.middlewear";




const app = express();
const runServer = async () => {
    //!Middlewear 
    // Helmet for secure headers
    app.use(helmet());
 
    app.use(express.urlencoded({ extended: true }));// used to parse incoming requests with URL-encoded payloads
    app.use(express.json());//parses incoming requests with JSON payloads
    app.use(morgan("dev"));

    // Cookie parser and flash
    app.use(cookieParser());
    app.use(flash());
    
 
    // Set up Handlebars view engine
    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set('views', __dirname+'/views');
    app.use(express.static(__dirname + "/public"));

    //REST Routes
    app.use("/",authRoutesRest)
    app.use("/",bookRoutesRest)

    //Admin  Routes
    app.use("/admin",adminRoutesMono)
    app.use(ErrorHandelingMiddlewear)
    connectMongooseDB()
}



export { runServer, app };