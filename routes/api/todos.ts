import { Handlers } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import {
  addTodo,
  deleteTodo,
  getTodosByUser,
  toggleTodo,
} from "../../utils/db.ts";
import { getCookies } from "$std/http/cookie.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

export const handler: Handlers<unknown, State> = {
  async GET(_req, ctx) {
    if (!ctx.state.user) return new Response("Unauthorized", { status: 401 });

    const todos = await getTodosByUser(ctx.state.user.id);
    return json(todos);
  },

  async POST(req, ctx) {
    if (!ctx.state.user) return new Response("Unauthorized", { status: 401 });

    // CSRF Kontrolü (Header üzerinden)
    const cookies = getCookies(req.headers);
    const csrfHeader = req.headers.get("x-csrf-token");
    if (!csrfHeader || csrfHeader !== cookies.csrf_token) {
      return new Response("CSRF Verification Failed", { status: 403 });
    }

    try {
      const body = await req.json();
      if (!isRecord(body)) {
        return new Response("Geçersiz JSON verisi.", { status: 400 });
      }

      const trimmedTitle = typeof body.title === "string"
        ? body.title.trim()
        : "";
      if (!trimmedTitle) {
        return new Response("Başlık zorunludur ve boş olamaz.", {
          status: 400,
        });
      }

      if (trimmedTitle.length > 200) {
        return new Response("Başlık çok uzun (Maksimum 200 karakter).", {
          status: 400,
        });
      }

      const description = typeof body.description === "string"
        ? body.description.trim().slice(0, 1000)
        : undefined;
      const categoryId = typeof body.categoryId === "string" &&
          body.categoryId.trim()
        ? body.categoryId.trim()
        : undefined;

      const todo = await addTodo(
        ctx.state.user.id,
        trimmedTitle,
        categoryId,
        description,
      );
      return json(todo, { status: 201 });
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
      const body = await req.json();
      if (!isRecord(body) || typeof body.id !== "string" || !body.id.trim()) {
        return new Response("ID zorunludur.", { status: 400 });
      }
      const id = body.id.trim();

      const todo = await toggleTodo(id, ctx.state.user.id);
      if (!todo) {
        return new Response("Todo bulunamadı veya yetkisiz", { status: 404 });
      }

      return json(todo);
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
      const body = await req.json();
      if (!isRecord(body) || typeof body.id !== "string" || !body.id.trim()) {
        return new Response("ID zorunludur.", { status: 400 });
      }
      const id = body.id.trim();

      const ok = await deleteTodo(id, ctx.state.user.id);
      return json({ success: ok }, {
        status: ok ? 200 : 400,
      });
    } catch (_err) {
      return new Response("Geçersiz JSON verisi.", { status: 400 });
    }
  },
};
