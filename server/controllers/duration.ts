import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import Project from "../models/Project.ts";

async function getDurationOf(path: string) {
    try {
        const t = await Deno.stat(path);
        if (!t.isFile) throw new Error();
    } catch (_) {
        return 0;
    }

    const result = await new Deno.Command("ffprobe", { args: [path, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1"] }).output();
    const string = new TextDecoder().decode(result.stdout);
    console.log(string);

    return Number(string) * 1000;
}

export async function get({ request, response }: Context) {
    const project = request.url.searchParams.get("project");
    

    if (!project) {
        response.status = 404;
        response.body = "";
    }

    const t = [];

    for await (const file of Deno.readDir(path.join(Project.getRoot(),"current"))) {
        if (file.name.includes("metadata")) continue;

        t.push(await getDurationOf(path.join(Project.getRoot(),"current", file.name)))
    }

    response.body = Math.min(...t);
    response.status = 200;
    return;
}