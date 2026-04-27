# Üniversite Final Projesi: Deno Fresh Todo Uygulaması
Öğrenci Adı Soyadı: MERLIN DE L OR AKENMOE KAMCHE
Öğrenci Numarası: 24080410153
Proje Adı: Deno runtime ve Fresh framework
Ders: Web Tabanlı Programlama -- Final Projesi
Tarih: 2026-04-27
Danışman: İRFAN ÖKTEN

## 1. Proje Açıklaması
Bu proje, Deno runtime ve Fresh framework (Islands mimarisi) kullanılarak geliştirilmiş, Preact tabanlı ve Twind/Tailwind CSS ile şekillendirilmiş bir Todo uygulamasıdır. Veriler Deno KV üzerinde tutulmaktadır. Kullanıcı giriş sistemi, karanlık tema, kategorize etme gibi özellikler barındırır.

## 2. Kullanılan Teknolojiler
- **Çalışma Zamanı (Runtime):** Deno
- **Framework:** Fresh
- **Arayüz Kütüphanesi:** Preact
- **Stil Motoru:** Twind / Tailwind CSS
- **Veritabanı:** Deno KV

## 3. Özellikler
- Kullanıcı yetkilendirmesi (Cookie tabanlı oturum)
- Görev ekleme, silme, tamamlama ve kategorize etme
- Karanlık (Dark) Tema geçişi
- Tamamen duyarlı (Responsive) modern arayüz tasarımı

## 4. Sistem Gereksinimleri
- Deno 1.40 veya üzeri

## 5. Kurulum (Installation)
1. Repoyu klonlayın: `git clone https://github.com/delor237/Final-projesi.git`
2. Proje dizinine gidin: `cd Final-projesi`
3. Çevresel değişkenleri ayarlayın: `cp .env.example .env` (Ve `.env` içerisini düzenleyin)

## 6. Nasıl Çalıştırılır (How to Run)
Geliştirme sunucusunu başlatmak için aşağıdaki komutu çalıştırın:
```bash
deno task start
```
Uygulama `http://localhost:8000` adresinde çalışacaktır.

## 7. Proje Yapısı (Repository Structure)
Projede `docs/`, `screenshots/`, `src/` klasörleri yer almaktadır. API anahtarları `.env` dosyasında tutulur, hiçbir şekilde koda hardcode edilmez.

## 8. Güvenlik
- Gizli anahtarlar ve veritabanı yolları asla kodda yer almaz (`.env` kullanımı).
- Kullanıcı girdileri dezenfekte edilerek XSS ve Injection zafiyetleri engellenmiştir.

## 9. Lisans (License)
Bu proje MIT lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakınız.

## 10. Ekran Görüntüleri / Demo GIF (Screenshots / Demo GIF)
*(Ekran görüntüleri `screenshots/` klasörüne eklenecektir.)*
