import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

import * as Ping from "./controllers/ping.ts";
import * as Video from "./controllers/video.ts";
import * as Duration from "./controllers/duration.ts";
import * as Project from "./controllers/project.ts";

const PORT = 8000;
const app = new Application();
const router = new Router();

router
    .get("/video", Video.get)
    .post("/video", Video.post)
    .get("/ping", Ping.get)
    .get("/project", Project.get)
    .post("/project", Project.post)
    .get("/duration", Duration.get);

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Running server on port ${PORT}`);

app.listen({
    port: PORT
});