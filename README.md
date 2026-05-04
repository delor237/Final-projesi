Öğrenci: Merlin Delor
Okul No: [INSERT_STUDENT_ID]

# 1. Proje Adı ve Kısa Açıklama
**Todo App (Deno & Fresh)**
Bu proje, modern ve hızlı bir web uygulaması geliştirmek amacıyla Deno çalışma zamanı (runtime) ve Fresh framework'ü kullanılarak inşa edilmiştir. Fresh'in "Islands" mimarisi sayesinde, sadece etkileşim gerektiren bileşenler istemci tarafında çalıştırılır (hydration), geri kalan kısımlar ise sunucuda (SSR) render edilerek tarayıcıya saf HTML olarak gönderilir. Bu yaklaşım, yüksek performans ve mükemmel bir kullanıcı deneyimi sağlar.

# 2. Ekran Görüntüsü / Demo GIF
![Uygulama Ekran Görüntüsü](./screenshots/demo.png)

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

# 8. Karşılaşılan Zorluklar ve Çözümler
1. **Zorluk:** Deno KV ile asenkron veri güncellemeleri sırasında "race condition" (yarış durumu) oluşması.
   **Çözüm:** Deno KV'nin sunduğu atomik işlemler (atomic operations) kullanılarak, veri yazma ve güncelleme işlemleri tek bir işlem bloku (transaction) içerisine alındı ve veri tutarlılığı sağlandı.
2. **Zorluk:** Fresh yönlendirme sisteminde, dinamik parametreleri alırken tip hataları yaşanması.
   **Çözüm:** `routes/[id].tsx` yapısında `Handlers` ve `PageProps` tipleri, projenin arayüzlerine (interfaces) göre özel olarak TypeScript ile yeniden tanımlandı ve güvenli veri akışı elde edildi.

# 9. Kaynaklar
* Deno Resmi Dokümantasyonu: https://deno.land/manual
* Fresh Resmi Dokümantasyonu: https://fresh.deno.dev/docs/introduction

# 10. Lisans
Bu proje MIT Lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz.
