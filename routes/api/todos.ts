import { Handlers } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { addTodo, deleteTodo, toggleTodo } from "../../utils/db.ts";
import { getCookies } from "$std/http/cookie.ts";

export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    if (!ctx.state.user) return new Response("Unauthorized", { status: 401 });
    
    // CSRF Kontrolü (Header üzerinden)
    const cookies = getCookies(req.headers);
    const csrfHeader = req.headers.get("x-csrf-token");
    if (!csrfHeader || csrfHeader !== cookies.csrf_token) {
      return new Response("CSRF Verification Failed", { status: 403 });
    }

    try {
      const { title, description, categoryId } = await req.json();
      
      const trimmedTitle = title?.trim();
      if (!trimmedTitle) {
        return new Response("Başlık zorunludur ve boş olamaz.", { status: 400 });
      }
      
      if (trimmedTitle.length > 200) {
        return new Response("Başlık çok uzun (Maksimum 200 karakter).", { status: 400 });
      }
      
      const todo = await addTodo(ctx.state.user.id, trimmedTitle, categoryId, description?.trim());
      return new Response(JSON.stringify(todo), { status: 201 });
    } catch (_err) {
      return new Response("Geçersiz JSON verisi.", { status: 400 });
    }
  },
  
  async PATCH(req, ctx) {
    if (!ctx.state.user) return new Response("Unauthorized", { status: 401 });
    
    const cookies = getCookies(req.headers);
    const csrfHeader = req.headers.get("x-csrf-token");
    if (!csrfHeader || csrfHeader !== cookies.csrf_token) {
      return new Response("CSRF Verification Failed", { status: 403 });
    }

    try {
      const { id } = await req.json();
      if (!id) return new Response("ID zorunludur.", { status: 400 });
      
      const todo = await toggleTodo(id, ctx.state.user.id);
      if (!todo) return new Response("Todo bulunamadı veya yetkisiz", { status: 404 });
      
      return new Response(JSON.stringify(todo));
    } catch (_err) {
      return new Response("Geçersiz JSON verisi.", { status: 400 });
    }
  },
  
  async DELETE(req, ctx) {
    if (!ctx.state.user) return new Response("Unauthorized", { status: 401 });
    
    const cookies = getCookies(req.headers);
    const csrfHeader = req.headers.get("x-csrf-token");
    if (!csrfHeader || csrfHeader !== cookies.csrf_token) {
      return new Response("CSRF Verification Failed", { status: 403 });
    }

    try {
      const { id } = await req.json();
      if (!id) return new Response("ID zorunludur.", { status: 400 });
      
      const ok = await deleteTodo(id, ctx.state.user.id);
      return new Response(JSON.stringify({ success: ok }), { status: ok ? 200 : 400 });
    } catch (_err) {
      return new Response("Geçersiz JSON verisi.", { status: 400 });
    }
  }
};
