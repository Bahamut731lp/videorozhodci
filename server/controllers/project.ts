import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import Project from "../models/Project.ts";

export async function get({ request, response }: Context) {
    const project = request.url.searchParams.get("name");

    if (!project) {
        response.status = 400;
        return;
    }

    const data = await Project.get(project);
    
    response.status = data.status;
    response.body = data;
    return;
}

export async function post({ request, response }: Context) {
    const project = await request.body().value;

    if (!project) {
        response.status = 400;
        return;
    }

    const { name, status } = await Project.create(project.name);
    response.status = status;
    response.body = name;
}