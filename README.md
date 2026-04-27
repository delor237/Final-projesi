Öğrenci: Merlin De L'Or Akenmoe
Okul No: 24080410153
Ders: Web Tabanlı Programlama -- Final Projesi
Tarih: 2026-04-27
Danışman: İRFAN ÖKTEN

# 1. Proje Adı ve Kısa Açıklama
**Deno Fresh Todo Uygulaması**

Bu proje, Deno runtime ve Fresh framework (Islands mimarisi) kullanılarak geliştirilmiş modern ve yüksek performanslı bir görev yönetim (Todo) sistemidir. Preact, Tailwind CSS ve Deno KV kullanılarak sıfırdan inşa edilmiş olup kullanıcı oturum yönetimi, güvenli veri saklama, karanlık/aydınlık tema (Dark Mode) gibi özellikleri desteklemektedir. Tamamen sunucu tarafında işlenen (SSR) ve adacıklar (Islands) yardımıyla etkileşimli hale getirilen bir mimari kurgulanmıştır.

# 2. Ekran Görüntüsü / Demo GIF
![Ekran Görüntüsü Placeholder](screenshots/demo.png)

# 3. Kullanılan Teknolojiler
- **Çalışma Zamanı (Runtime):** Deno (Güvenli, TypeScript destekli)
- **Framework:** Fresh (JIT rendering, sıfır JS kuralı, Islands mimarisi)
- **Veritabanı:** Deno KV (Yerleşik, anahtar-değer tabanlı veritabanı)
- **Kullanıcı Arayüzü:** Preact & Preact Signals
- **Stil Yönetimi:** Twind / Tailwind CSS
- **Güvenlik:** Deno Web Crypto API (SHA-256 Hashing), HTTP-Only Cookies

# 4. Kurulum Adımları
1. Repoyu bilgisayarınıza klonlayın:
   ```bash
   git clone https://github.com/delor237/Final-projesi.git
   ```
2. Proje dizinine giriş yapın:
   ```bash
   cd Final-projesi
   ```
3. Örnek ortam değişkenleri dosyasını kopyalayarak `.env` dosyasını oluşturun ve içini düzenleyin:
   ```bash
   cp .env.example .env
   ```

# 5. Nasıl Çalıştırılır
Projeyi çalıştırmak için bilgisayarınızda Deno'nun yüklü olması gerekir. Gerekli tüm izinleri (ağ, dosya okuma/yazma, ortam değişkeni) ve Kararsız (Unstable) KV API desteğini sağlayarak çalıştırmak için aşağıdaki komutu kullanın:

```bash
deno run --allow-net --allow-read --allow-env --allow-write --unstable-kv --watch=static/,routes/ dev.ts
```

Uygulama başarıyla başlatıldığında tarayıcınızdan `http://localhost:8000` adresine giderek erişebilirsiniz.

# 6. Proje Yapısı Açıklaması
- `routes/`: Fresh framework'ünün dosya tabanlı yönlendirme (routing) sistemini içerir. (`_middleware.ts`, `_app.tsx`, `index.tsx`, `login.tsx`, `api/`)
- `islands/`: Tarayıcı tarafında çalışan, etkileşimli (interaktif) Preact bileşenleridir. (`TodoForm.tsx`, `TodoList.tsx`, `ThemeToggle.tsx`)
- `components/`: Sunucu tarafında (SSR) render edilen, etkileşimsiz statik UI bileşenleridir. (`Navbar.tsx`)
- `utils/`: Veritabanı bağlantısı (`db.ts`), şifreleme ve oturum yönetimi (`auth.ts`) ile global sinyalleri (`store.ts`) içerir.
- `static/`: Stil dosyaları ve statik kaynaklar.
- `docs/` & `screenshots/`: Gerekli proje belgeleri ve ekran görüntüleri.

# 7. Öne Çıkan Özellikler
- **Güvenli Oturum Yönetimi:** Şifreler düz metin olarak tutulmaz, SHA-256 ile hash'lenir. Giriş yapan kullanıcılara özel UUID atanarak Session oluşturulur ve yetkisiz erişimler Middleware aracılığıyla engellenir.
- **Islands Mimarisi:** Form gönderimi ve liste güncellemeleri sayfa yenilenmeden, Optimistic UI yaklaşımıyla anında gerçekleşir.
- **Karanlık Tema (Dark Mode):** Sistem tercihlerini okuyan ve LocalStorage ile tercihleri hatırlayan entegre karanlık tema.
- **Tamamen Bağımsız Deno KV:** Harici bir sunucu kurmaya gerek kalmadan tüm veriler gömülü bir şekilde Deno KV'de saklanır.

# 8. Karşılaşılan Zorluklar ve Çözümler
- **Zorluk:** Deno Fresh framework'ünde adacıklar (Islands) arası durum (state) yönetimi.
- **Çözüm:** `TodoForm` (ekleme) ve `TodoList` (listeleme) adacıklarının senkronize çalışması için `@preact/signals` kullanılarak global bir state (`utils/store.ts`) oluşturuldu. Böylece bir görev eklendiğinde liste anında güncellendi.
- **Zorluk:** Güvenlik ve gizli anahtarların yönetimi.
- **Çözüm:** Herhangi bir API key veya DB yolu kaynak koda hardcode edilmedi, tüm kritik bilgiler `.env` üzerinden çekilerek sistem güvenlik gereksinimlerine uyarlandı.

# 9. Kaynaklar
- [Deno Resmi Dokümantasyonu](https://docs.deno.com/runtime/)
- [Fresh Framework Rehberi](https://fresh.deno.dev/docs/introduction)
- [Preact & Signals](https://preactjs.com/guide/v10/signals/)
- [Deno KV Dokümantasyonu](https://docs.deno.com/deploy/kv/manual/)

# 10. Lisans
Bu proje MIT Lisansı altında lisanslanmıştır. Kullanım ve kopyalama detayları için repo kök dizinindeki `LICENSE` dosyasına bakabilirsiniz.
