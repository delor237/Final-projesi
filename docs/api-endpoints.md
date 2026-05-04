# API Uç Noktaları ve Yönlendirme (Routes)

Proje, Deno Fresh framework'ünün esnek ve dosya tabanlı yönlendirme (file-system routing) yapısı üzerine inşa edilmiştir.

## Middleware ve Oturum Yönetimi (Auth Flow)
Güvenlik ve erişim denetimi `routes/_middleware.ts` dosyası üzerinden merkezi olarak yönetilmektedir:
1. İstemciden (tarayıcıdan) gelen her istekte `session_id` çerezi (cookie) kontrol edilir.
2. Eğer geçerli bir oturum bulunamazsa ve kullanıcı yetki gerektiren bir rotaya (`/dashboard` gibi) erişmek isterse, sistem HTTP 302 durumuyla kullanıcıyı `/login` rotasına yönlendirir.
3. Yetki gerektirmeyen (Public) sayfalar herkesin erişimine açıktır.

## Uygulama Rotaları (Pages)
- **`GET /`** : Ana sayfa (Landing Page). Proje tanıtımı ve giriş bağlantılarını içerir.
- **`GET /login`** : Kullanıcıların oturum açtığı sayfadır. Form verileri sunucuya gönderilir.
- **`GET /register`** : Sisteme yeni kullanıcı kaydetme sayfası.
- **`GET /dashboard`** : Kullanıcıya özel kontrol paneli. (Giriş zorunludur).

## API Uç Noktaları (Endpoints)
- **`GET /api/todos`** : Oturumu açık olan kullanıcının tüm görev kayıtlarını JSON formatında getirir.
- **`POST /api/todos`** : Sisteme yeni bir görev ekler. Gelen veriler sunucuda doğrulanır ve Deno KV'ye yazılır.
- **`PUT /api/todos/[id]`** : Dinamik olarak belirtilen `id` değerindeki görevin bilgilerini (örneğin tamamlandı/tamamlanmadı durumu) günceller.
- **`DELETE /api/todos/[id]`** : Belirtilen `id` değerine sahip görevi veritabanından kalıcı olarak siler.
