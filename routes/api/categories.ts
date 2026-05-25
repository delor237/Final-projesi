import { Handlers } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import {
  addCategory,
  deleteCategory,
  getCategoriesByUser,
  updateCategory,
} from "../../utils/db.ts";

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

function readCategoryInput(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const color = typeof body.color === "string" ? body.color.trim() : "";
  const csrf = typeof body._csrf === "string" ? body._csrf : "";
  return { name, color, csrf };
}

export const handler: Handlers<unknown, State> = {
  async GET(_req, ctx) {
    if (!ctx.state.user) {
      return json({ error: "Yetkisiz erişim" }, {
        status: 401,
      });
    }

    const categories = await getCategoriesByUser(ctx.state.user.id);
    return json(categories);
  },

  async POST(req, ctx) {
    if (!ctx.state.user) {
      return json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();
    if (!isRecord(body)) {
      return json({ error: "Geçersiz JSON verisi" }, { status: 400 });
    }
    const { name, color, csrf } = readCategoryInput(body);

    if (!csrf || csrf !== ctx.state.csrfToken) {
      return json({ error: "Güvenlik doğrulaması başarısız" }, {
        status: 403,
      });
    }

    if (!name) {
      return json({ error: "Kategori adı boş olamaz" }, { status: 400 });
    }

    if (name.length > 50) {
      return json({ error: "Kategori adı en fazla 50 karakter olabilir" }, {
        status: 400,
      });
    }

    // Basit bir hex color doğrulama
    if (!color || !/^#[0-9A-Fa-f]{6}$/i.test(color)) {
      return json({ error: "Geçerli bir renk seçin (Örn: #FF0000)" }, {
        status: 400,
      });
    }

    try {
      const category = await addCategory(ctx.state.user.id, name, color);
      return json(category, { status: 201 });
    } catch (_err) {
      return json({ error: "Kategori oluşturulurken hata oluştu" }, {
        status: 500,
      });
    }
  },

  async PATCH(req, ctx) {
    if (!ctx.state.user) {
      return json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();
    if (!isRecord(body)) {
      return json({ error: "Geçersiz JSON verisi" }, { status: 400 });
    }
    const { name, color, csrf } = readCategoryInput(body);
    const id = typeof body.id === "string" ? body.id.trim() : "";

    if (!csrf || csrf !== ctx.state.csrfToken) {
      return json({ error: "Güvenlik doğrulaması başarısız" }, {
        status: 403,
      });
    }

    if (!id || !name || !color) {
      return json({ error: "Eksik parametre" }, { status: 400 });
    }

    if (!/^#[0-9A-Fa-f]{6}$/i.test(color)) {
      return json({ error: "Geçerli bir renk seçin" }, {
        status: 400,
      });
    }

    try {
      const updated = await updateCategory(
        id,
        ctx.state.user.id,
        name.trim(),
        color,
      );
      if (!updated) {
        return json({ error: "Kategori bulunamadı veya size ait değil" }, {
          status: 404,
        });
      }
      return json(updated, { status: 200 });
    } catch (_err) {
      return json({ error: "Kategori güncellenirken hata oluştu" }, {
        status: 500,
      });
    }
  },

  async DELETE(req, ctx) {
    if (!ctx.state.user) {
      return json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();
    if (!isRecord(body)) {
      return json({ error: "Geçersiz JSON verisi" }, { status: 400 });
    }
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const csrf = typeof body._csrf === "string" ? body._csrf : "";

    if (!csrf || csrf !== ctx.state.csrfToken) {
      return json({ error: "Güvenlik doğrulaması başarısız" }, {
        status: 403,
      });
    }

    if (!id) {
      return json({ error: "Eksik parametre" }, { status: 400 });
    }

    try {
      const success = await deleteCategory(id, ctx.state.user.id);
      if (!success) {
        return json({ error: "Kategori silinemedi veya size ait değil" }, {
          status: 400,
        });
      }
      return json({ success: true }, { status: 200 });
    } catch (_err) {
      return json({ error: "Kategori silinirken hata oluştu" }, {
        status: 500,
      });
    }
  },
};
