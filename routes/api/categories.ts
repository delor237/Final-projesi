import { Handlers } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { addCategory, updateCategory, deleteCategory } from "../../utils/db.ts";

export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    if (!ctx.state.user) {
      return new Response(JSON.stringify({ error: "Yetkisiz erişim" }), { status: 401 });
    }

    const { name, color, _csrf } = await req.json();

    if (!_csrf || _csrf !== ctx.state.csrfToken) {
      return new Response(JSON.stringify({ error: "Güvenlik doğrulaması başarısız" }), { status: 403 });
    }

    if (!name || name.trim() === "") {
      return new Response(JSON.stringify({ error: "Kategori adı boş olamaz" }), { status: 400 });
    }
    
    // Basit bir hex color doğrulama
    if (!color || !/^#[0-9A-Fa-f]{6}$/i.test(color)) {
      return new Response(JSON.stringify({ error: "Geçerli bir renk seçin (Örn: #FF0000)" }), { status: 400 });
    }

    try {
      const category = await addCategory(ctx.state.user.id, name.trim(), color);
      return new Response(JSON.stringify(category), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Kategori oluşturulurken hata oluştu" }), { status: 500 });
    }
  },

  async PATCH(req, ctx) {
    if (!ctx.state.user) {
      return new Response(JSON.stringify({ error: "Yetkisiz erişim" }), { status: 401 });
    }

    const { id, name, color, _csrf } = await req.json();

    if (!_csrf || _csrf !== ctx.state.csrfToken) {
      return new Response(JSON.stringify({ error: "Güvenlik doğrulaması başarısız" }), { status: 403 });
    }

    if (!id || !name || !color) {
      return new Response(JSON.stringify({ error: "Eksik parametre" }), { status: 400 });
    }

    if (!/^#[0-9A-Fa-f]{6}$/i.test(color)) {
      return new Response(JSON.stringify({ error: "Geçerli bir renk seçin" }), { status: 400 });
    }

    try {
      const updated = await updateCategory(id, ctx.state.user.id, name.trim(), color);
      if (!updated) {
        return new Response(JSON.stringify({ error: "Kategori bulunamadı veya size ait değil" }), { status: 404 });
      }
      return new Response(JSON.stringify(updated), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Kategori güncellenirken hata oluştu" }), { status: 500 });
    }
  },

  async DELETE(req, ctx) {
    if (!ctx.state.user) {
      return new Response(JSON.stringify({ error: "Yetkisiz erişim" }), { status: 401 });
    }

    const { id, _csrf } = await req.json();

    if (!_csrf || _csrf !== ctx.state.csrfToken) {
      return new Response(JSON.stringify({ error: "Güvenlik doğrulaması başarısız" }), { status: 403 });
    }

    if (!id) {
      return new Response(JSON.stringify({ error: "Eksik parametre" }), { status: 400 });
    }

    try {
      const success = await deleteCategory(id, ctx.state.user.id);
      if (!success) {
        return new Response(JSON.stringify({ error: "Kategori silinemedi veya size ait değil" }), { status: 400 });
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Kategori silinirken hata oluştu" }), { status: 500 });
    }
  }
};
