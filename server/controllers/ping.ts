import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";

export function get({ response }: Context) {
    response.status = 200;
    response.body = "pong";
}