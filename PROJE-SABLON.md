# Proje Şablonu

**Öğrenci Adı:** Merlin Delor
**Okul Numarası:** [INSERT_STUDENT_ID]

**Proje Başlığı:** P26 Deno Fresh Framework
**Zorluk Derecesi:** Orta-Zor
**Değerlendirme Puanı:** 50 Puan

## 1. Projenin Amacı ve Kapsamı
Bu projenin temel amacı, yenilikçi Deno çalışma zamanı (runtime) ve modern Fresh framework'ü kullanılarak yüksek performanslı, SSR (Server-Side Rendering) tabanlı bir web uygulaması geliştirmektir. Proje kapsamında, Islands mimarisi sayesinde sadece gerekli bileşenlerde istemci tarafı etkileşimi sağlanarak optimize edilmiş bir kullanıcı deneyimi sunulması hedeflenmektedir. Uygulama içi veri kalıcılığı Deno'nun yerleşik aracı olan Deno KV ile sağlanmaktadır.

## 2. Kullanılan Teknolojiler
* **Çalışma Zamanı (Runtime):** Deno
* **Web Framework:** Fresh
* **Kullanıcı Arayüzü (UI):** Preact
* **Stil ve Tasarım:** Twind (Tailwind tabanlı CSS-in-JS)
* **Veritabanı:** Deno KV

## 3. Temel İşlevler ve Özellikler
* Yeni görevlerin (Todo) hızlı bir şekilde sisteme eklenebilmesi.
* Görevlerin güncel durumlarıyla birlikte listelenmesi.
* Görevlerin tamamlandı/tamamlanmadı olarak işaretlenebilmesi ve güncellenmesi.
* İstenmeyen görevlerin sistemden silinebilmesi.
* Tüm veri işlemlerinin Deno KV üzerinde güvenli ve kalıcı (persistent) olarak yönetilmesi.
* Gece/Gündüz (Dark Mode) tema desteği ve hızlı etkileşim (Client-side hydration).

## 4. Değerlendirme Kriterleri ve Beklentiler
* Projenin belirtilen adımlarla (örneğin `deno task start`) sorunsuz bir şekilde ayağa kalkması.
* Öğrenci ve proje kimlik bilgilerinin dokümanlarda eksiksiz yer alması.
* Deno KV ile veri okuma/yazma işlemlerinin (CRUD) hatasız gerçekleştirilmesi.
* Clean code prensiplerine uygun, okunabilir ve modüler Preact/Fresh bileşen yapısı.
* Git versiyon kontrol sisteminin düzenli ve anlamlı commit'lerle kullanılmış olması.
