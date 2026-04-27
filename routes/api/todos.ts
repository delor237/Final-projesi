import { Handlers } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { addTodo, deleteTodo, toggleTodo } from "../../utils/db.ts";

export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    if (!ctx.state.user) return new Response("Unauthorized", { status: 401 });
    
    const { title, description, categoryId } = await req.json();
    if (!title) return new Response("Başlık zorunludur", { status: 400 });
    
    const todo = await addTodo(ctx.state.user.id, title, categoryId, description);
    return new Response(JSON.stringify(todo), { status: 201 });
  },
  
  async PATCH(req, ctx) {
    if (!ctx.state.user) return new Response("Unauthorized", { status: 401 });
    
    const { id } = await req.json();
    const todo = await toggleTodo(id, ctx.state.user.id);
    
    if (!todo) return new Response("Todo bulunamadı veya yetkisiz", { status: 404 });
    return new Response(JSON.stringify(todo));
  },
  
  async DELETE(req, ctx) {
    if (!ctx.state.user) return new Response("Unauthorized", { status: 401 });
    
    const { id } = await req.json();
    const ok = await deleteTodo(id, ctx.state.user.id);
    
    return new Response(JSON.stringify({ success: ok }), { status: ok ? 200 : 400 });
  }
};
