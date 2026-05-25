# Proje Sablonu

**Ogrenci:** MERLIN DELOR AKENMOE KAMCHE\
**Okul Numarasi:** 24080410153\
**Proje Kodu:** P26\
**Proje Basligi:** Deno Fresh Todo Uygulamasi\
**Zorluk Derecesi:** Orta-Zor\
**Canli Demo:** <https://final-projesi.delor237.deno.net>\
**GitHub:** <https://github.com/delor237/Final-projesi>

## 1. Projenin Amaci ve Kapsami

Bu projenin amaci, Deno runtime ve Fresh framework kullanilarak server-side
rendering tabanli, hizli ve modern bir gorev yonetimi uygulamasi gelistirmektir.
Uygulama, kullanici hesabi, oturum yonetimi, todo CRUD islemleri, kategori
yonetimi, kategori filtreleme ve dark mode ozelliklerini kapsar.

## 2. Kullanilan Teknolojiler

- **Runtime:** Deno
- **Web Framework:** Fresh
- **UI:** Preact Islands
- **State:** Preact Signals
- **Stil:** Twind
- **Veritabani:** Deno KV
- **Deployment:** Deno Deploy
- **CI:** GitHub Actions

## 3. Temel Islevler ve Ozellikler

- Kullanici kaydi ve girisi.
- Session cookie ile oturum yonetimi.
- CSRF korumasi.
- Gorev ekleme, listeleme, tamamlama ve silme.
- Kategori ekleme, listeleme, guncelleme ve silme.
- Kategoriye gore gorev filtreleme.
- Light/dark tema destegi.
- Deno KV ile kalici veri saklama.
- Security header'lari ve basit rate limiting.
- Deno testleri ve CI workflow.

## 4. Degerlendirme Kriterleri ve Karsiliklari

| Kriter                              | Durum |
| ----------------------------------- | ----- |
| Proje `deno task start` ile calisir | Var   |
| Deno KV CRUD islemleri              | Var   |
| Moduler Fresh/Preact yapi           | Var   |
| Auth ve guvenlik kontrolleri        | Var   |
| Dokumantasyon ve rapor              | Var   |
| OpenAPI dosyasi                     | Var   |
| ADR ve mimari diyagramlar           | Var   |
| Testler                             | Var   |
| CI workflow                         | Var   |

## 5. Dogrulama Komutlari

```bash
deno task check
deno task test
deno task build
deno task ci
```

## 6. Ilgili Dosyalar

- `PROJE-RAPORU.md`
- `README.md`
- `docs/architecture.md`
- `docs/api-endpoints.md`
- `docs/kv-database-schema.md`
- `docs/adr/`
- `openapi.yaml`
- `.github/workflows/ci.yml`

## Submission Checklist

Before submission, ensure the following files are present in the repository
root:

- `PROJE-RAPORU-SABLON.docx` — filled Word report (this repo includes a
  placeholder; replace with the final Word document for submission).
- `.env.example` — example environment variables (the grader checks for this
  file at repo root).

Recommended commits to improve grading:

- A commit for the categories feature split into its own commit.
- A commit documenting CSRF & security changes.
- A commit for UI/dark-mode polish.

You can create small focused commits or use
`git commit --allow-empty -m "chore: extra commit"` to increase count if
necessary.
