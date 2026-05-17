Öğrenci: Merlin Delor
Okul No: 24080410153

# 1. Proje Adı ve Kısa Açıklama
**Todo App (Deno & Fresh)**

🚀 **Canlı Demo (Live URL):** [https://final-projesi.delor237.deno.net](https://final-projesi.delor237.deno.net)

Bu proje, modern ve hızlı bir web uygulaması geliştirmek amacıyla Deno çalışma zamanı (runtime) ve Fresh framework'ü kullanılarak inşa edilmiştir. Fresh'in "Islands" mimarisi sayesinde, sadece etkileşim gerektiren bileşenler istemci tarafında çalıştırılır (hydration), geri kalan kısımlar ise sunucuda (SSR) render edilerek tarayıcıya saf HTML olarak gönderilir. Bu yaklaşım, yüksek performans ve mükemmel bir kullanıcı deneyimi sağlar.

# 2. Ekran Görüntüleri (Screenshots)

Aşağıda uygulamanın temel işlevlerini ve tasarımını gösteren ekran görüntüleri bulunmaktadır:

### Ana Ekran ve Görev Listesi (Light Mode)
![Ana Ekran](./screenshots/demo.png)

### Karanlık Mod (Dark Mode)
![Karanlık Mod](./screenshots/dark-mode.png)

### Kategori Yönetimi
![Kategori Yönetimi](./screenshots/categories.png)

### Kullanıcı Giriş Ekranı
![Giriş Ekranı](./screenshots/login.png)

### Mobil Görünüm (Responsive)
![Mobil Görünüm](./screenshots/mobile-view.png)

# 3. Kullanılan Teknolojiler
* **Deno:** Güvenli, modern ve hızlı JavaScript/TypeScript çalışma zamanı.
* **Fresh:** Deno tabanlı, JIT render ve Islands mimarisine sahip yeni nesil web framework.
* **Preact:** React'in hafif ve hızlı bir alternatifi (Fresh tarafından UI bileşenleri için kullanılır).
* **Deno KV:** Deno'nun yerleşik, anahtar-değer (key-value) tabanlı veritabanı çözümü.
* **Twind:** Tailwind CSS tabanlı, çalışma zamanında (runtime) derlenen stil çözümü.

# 4. Kurulum Adımları
Projeyi bilgisayarınızda çalıştırmak için öncelikle Deno'nun kurulu olması gerekmektedir. 
Deno'yu kurmak için resmi dokümantasyona göz atabilirsiniz (örneğin Windows için PowerShell'de: `irm https://deno.land/install.ps1 | iex`).

Deno kurulumundan sonra projeyi klonlayın ve proje dizinine gidin. Deno, gerekli paketleri otomatik olarak indirecektir. Ağ erişimi ve ortam değişkenleri okuma gibi izinler gerektiğinden, çalıştırma sırasında çeşitli bayraklar (flags) kullanılmalıdır. (Örn: `--allow-net`, `--allow-read`, `--allow-env`).

# 5. Nasıl Çalıştırılır
Projeyi geliştirme modunda çalıştırmak için proje dizininde aşağıdaki komutu kullanabilirsiniz:
```bash
deno task start
```
Bu komut, `deno.json` dosyasında tanımlı olan betiği çalıştırır ve genellikle `http://localhost:8000` adresinde uygulamayı başlatır.

# 6. Proje Yapısı Açıklaması
* `routes/`: Fresh framework'ünde dosya tabanlı yönlendirme (file-system routing) klasörüdür. Buradaki her dosya veya klasör bir URL yoluna (endpoint) karşılık gelir.
* `islands/`: İstemci tarafında etkileşimli olacak (hydrated) Preact bileşenlerinin bulunduğu klasördür.
* `components/`: Sunucu tarafında render edilen, tekrar kullanılabilir (etkileşimsiz) UI bileşenleridir.
* `static/`: Resimler, CSS dosyaları gibi statik varlıkların (assets) barındırıldığı klasördür.
* `utils/`: Veritabanı bağlantısı (`db.ts`) gibi yardımcı fonksiyonların ve araçların bulunduğu klasördür.
* `deno.json`: Proje yapılandırması, bağımlılıklar ve görev (task) tanımlarını içerir.

# 7. Öne Çıkan Özellikler
* **Server-Side Rendering (SSR):** Sayfaların sunucuda oluşturulması sayesinde hızlı ilk yükleme ve iyi SEO performansı.
* **Edge Deployment Uyumluluğu:** Uygulama, Deno Deploy gibi uç (edge) ağlarda çalışmaya tam uyumlu olarak tasarlanmıştır.
* **Deno KV Entegrasyonu:** Harici bir veritabanı sunucusuna ihtiyaç duymadan, yerleşik anahtar-değer veritabanı ile hızlı veri saklama ve erişimi.
* **CSRF Koruması (Security):** Form gönderimlerinde ve API isteklerinde Session tabanlı CSRF (Cross-Site Request Forgery) koruması uygulanmıştır.
* **Şifreleme (Password Hashing):** Kullanıcı şifreleri veritabanına düz metin olarak değil, "Salt" (tuz) eklenerek SHA-256 algoritmasıyla şifrelenerek kaydedilir.
* **Atomik İşlemler (Atomic Transactions):** Deno KV'nin `kv.atomic()` özelliği sayesinde, örneğin kategori silinirken ona bağlı tüm görevlerin güncellenmesi işlemi veri tutarsızlığı (data inconsistency) yaşanmadan tek seferde gerçekleştirilir.
* **TypeScript Doğal Desteği (Native Support):** Deno'nun yerleşik TypeScript desteği sayesinde derleme adımına gerek kalmadan, tip güvenli (type-safe) kod geliştirme avantajı sağlanmıştır.
* **Sıfır npm Bağımlılığı (Zero npm Dependencies):** Projede `node_modules` klasörü veya `package.json` bulunmaz. Gerekli tüm modüller (Preact dahil) URL üzerinden ESM olarak içe aktarılır.

# 8. Gelecek Geliştirmeler (Future Improvements)
* **Bitiş Tarihleri (Due Dates):** Görevlere tamamlanması gereken son tarihleri ekleme özelliği.
* **Görev Öncelikleri (Todo Priorities):** Görevleri Yüksek, Orta, Düşük öncelikli olarak sınıflandırma.
* **Paylaşımlı Görevler (Collaboration):** Farklı kullanıcıların aynı görev listesi üzerinde ortak çalışabilmesi.
* **Dışa/İçe Aktarma (Export/Import):** Kullanıcı verilerini JSON formatında dışa aktarma ve geri yükleme imkanı.
* **Zengin Metin (Rich Text):** Görev açıklamaları için Markdown veya zengin metin editörü entegrasyonu.

# 9. Teknik Detaylar
* **Islands Mimarisi Avantajları:** Klasik React uygulamaları (SPA) tüm JavaScript paketini istemciye gönderirken, Fresh sadece etkileşimli bileşenleri (Islands) istemciye gönderir. Bu durum sayfa yükleme hızını dramatik ölçüde artırır.
* **Neden Node.js Yerine Deno?** Deno, Node.js'in tasarım hatalarını gideren, daha güvenli (varsayılan olarak dışa kapalı), daha hızlı ve yerleşik araçlara (linter, formatter, test runner, KV) sahip olan modern bir çalışma zamanıdır.
* **Deno İzin Sistemi:** Deno varsayılan olarak diske veya ağa erişemez. Projenin çalışması için `deno.json` üzerinden `--allow-net` (ağ bağlantıları için), `--allow-read` (statik dosyaları okumak için) ve `--allow-env` (çevre değişkenlerini okumak için) izinleri açıkça verilmiştir.
* **Dosya Tabanlı Yönlendirme (File-based Routing):** Fresh, `routes/` klasöründeki dosya isimlerine bakarak URL yollarını otomatik oluşturur (Örn: `routes/login.tsx` -> `/login`).
* **Deno KV Atomic Operations:** Birden fazla veritabanı okuma/yazma işlemi, tek bir atomik işlem bloğu içinde çalıştırılır. İşlem sırasında bir hata çıkarsa değişiklikler geri alınır (rollback), böylece veritabanı her zaman tutarlı kalır.

# 10. Karşılaşılan Zorluklar ve Çözümler
1. **Zorluk:** Deno KV ile asenkron veri güncellemeleri sırasında "race condition" (yarış durumu) oluşması.
   **Çözüm:** Deno KV'nin sunduğu atomik işlemler (atomic operations) kullanılarak, veri yazma ve güncelleme işlemleri tek bir işlem bloku (transaction) içerisine alındı ve veri tutarlılığı sağlandı.
2. **Zorluk:** Fresh yönlendirme sisteminde, dinamik parametreleri alırken tip hataları yaşanması.
   **Çözüm:** `routes/[id].tsx` yapısında `Handlers` ve `PageProps` tipleri, projenin arayüzlerine (interfaces) göre özel olarak TypeScript ile yeniden tanımlandı ve güvenli veri akışı elde edildi.

# 11. Kaynaklar
* Deno Resmi Dokümantasyonu: https://deno.land/manual
* Fresh Dokümantasyonu: https://fresh.deno.dev/
* Deno KV Rehberi: https://deno.land/manual/runtime/kv
* Islands Mimarisi Açıklaması: https://fresh.deno.dev/docs/concepts/architecture
* Preact Dokümantasyonu: https://preactjs.com/
* Proje geliştirilirken Deno KV ve Preact Hooks konularında çeşitli Stack Overflow tartışmaları ve Deno GitHub Issues kayıtlarından faydalanılmıştır.

# 12. Lisans
Bu proje MIT Lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz.
