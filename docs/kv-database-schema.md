# Deno KV Veritabanı Şeması

Bu proje veri depolama için Deno'nun yerleşik, anahtar-değer tabanlı veritabanı çözümü olan **Deno KV**'yi kullanmaktadır. Aşağıda projede kullanılan temel veri yapılarının anahtar (key) hiyerarşisi açıklanmıştır.

## 1. Kullanıcılar (Users)
Kullanıcı bilgileri benzersiz bir ID ile saklanır ve kimlik doğrulama süreçlerinde kullanılır.

* **Anahtar Yapısı (Key):** `["users", <kullanici_id>]`
* **Örnek Değer (Value):**
  ```typescript
  {
    id: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
  }
  ```

## 2. Görevler (Todos)
Görevler, her bir kullanıcının benzersiz ID'sine bağlı olarak kümelenir. Bu mimari, belirli bir kullanıcının görevlerini hızlıca sorgulamayı kolaylaştırır.

* **Anahtar Yapısı (Key):** `["todos", <kullanici_id>, <todo_id>]`
* **Örnek Değer (Value):**
  ```typescript
  {
    id: string;
    userId: string;
    title: string;
    completed: boolean;
    categoryId: string | null;
    createdAt: Date;
  }
  ```

## 3. Kategoriler (Categories)
Görevleri gruplandırmak veya etiketlemek için kullanılan yapısal birimlerdir. Sisteme özel tanımlanabilir.

* **Anahtar Yapısı (Key):** `["categories", <kategori_id>]`
* **Örnek Değer (Value):**
  ```typescript
  {
    id: string;
    name: string; // Örn: "İş", "Kişisel"
    colorCode: string; // Örn: "#FF5733"
  }
  ```
