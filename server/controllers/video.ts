import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import Project from "../models/Project.ts";

export async function get({ request, response }: Context) {
    const range = request.headers.get("range");
    const device = request.url.searchParams.get("device");
    const root = Deno.env.get("PROJECTS_DIRECTORY") ?? "."

    if (!device) {
        response.status = 404;
        return;
    }

    const fileName = path.toFileUrl(path.resolve(root, "current", device));

    try {
        await Deno.stat(fileName);
    } catch (error) {
        response.status = 404;
        return;   
    }

    const videoSize = (await Deno.stat(fileName)).size;

    if (!range) {
        response.headers.set("Content-Length", videoSize);
        response.headers.set("Content-Type", "video/x-matroska;codecs=avc1");

        response.body = await Deno.readFile(new URL(fileName, import.meta.url));
        return;
    }

    let [start, end] = range.replace(/bytes=/, '').split('-');
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : videoSize - 1;
    const maxChunk = 1024 * 1024;
    if (((end - start + 1)) > maxChunk) {
        end = start + maxChunk - 1;
    }

    response.headers.set("Content-Range", `bytes ${start}-${end}/${videoSize}`);
    response.headers.set("Accept-Ranges", "bytes");
    response.headers.set("Content-Length", (end - start) + 1);

    let seek;
    if (start === 0) {
        seek = Deno.SeekMode.Start;
    } else if (end === videoSize - 1) {
        seek = Deno.SeekMode.End;
    } else {
        seek = Deno.SeekMode.Current;
    }

    const file = await Deno.open(new URL(fileName, import.meta.url), { read: true });
    await Deno.seek(file.rid, start, seek);
    const content = new Uint8Array(end - start + 1);
    await file.read(content);
    file.close();

    response.type = "video/mp4";
    response.status = 206;
    response.body = content;
}

export async function post({ request, response }: Context) {
    const body = await request.body().value;
    const device = request.headers.get("x-device");

    //TODO: Nějak do metadat nacpat info o přenosech, co mi sem přijdou
    await Project.create("current");
    const project = await Project.get("current");

    if (!device) {
        response.status = 404;
        return;
    }

    await Deno.writeFile(path.join(project.directory, device), body, { append: true });
    response.status = 200;
}