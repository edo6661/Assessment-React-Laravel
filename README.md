# Cara Menjalankan Project

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi (Backend & Frontend).

## Backend (Server)

Masuk ke folder server lalu jalankan perintah berikut secara berurutan:

## 1. Install dependencies (Node modules & PHP packages)

npm install
composer install

## 2. Setup database (pastikan file .env sudah dikonfigurasi)

php artisan migrate

## 3. Jalankan server (Start API Endpoint)

php artisan serve

## Frontend (Client)

Buka terminal baru, masuk ke folder client, lalu jalankan:

## 1. Install dependencies

npm install

## 2. Jalankan mode development

npm run dev

# Jawaban Soal 1 - 4

## 1. Apa itu REST API?

**REST (Representational State Transfer) API** adalah gaya arsitektur perangkat lunak untuk komunikasi antar sistem di web.

- **Konsep Utama:** Menggunakan protokol HTTP standar.
- **Metode:** Memanfaatkan HTTP verbs seperti `GET` (baca), `POST` (buat), `PUT` (ubah), dan `DELETE` (hapus).
- **Format Data:** Umumnya menggunakan **JSON** atau XML.
- **Sifat:** _Stateless_ (server tidak menyimpan status sesi dari client antar request).

---

## 2. Apa itu CORS dan Cara Menanganinya?

**CORS (Cross-Origin Resource Sharing)** adalah fitur keamanan browser yang membatasi aplikasi web di satu domain (_origin_) untuk mengakses resource di domain yang berbeda.

- **Masalah:** Secara default, browser memblokir request lintas domain (misal: frontend di `localhost:3000` akses backend di `localhost:5000`) demi keamanan.
- **Cara Menangani di Backend:**
  Anda harus mengkonfigurasi server untuk mengirimkan header HTTP `Access-Control-Allow-Origin` dalam responsnya.

  **Contoh Header:**

  ```http
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  ```

  _(Catatan: Tanda `_` mengizinkan semua domain, namun untuk produksi sebaiknya diganti dengan domain spesifik frontend Anda).\*

---

## 3. Perbedaan SQL vs NoSQL

| Fitur        | SQL (Relational)                        | NoSQL (Non-Relational)                                    |
| :----------- | :-------------------------------------- | :-------------------------------------------------------- |
| **Struktur** | Berbasis **Tabel** (Baris & Kolom).     | Beragam (Dokumen, Key-Value, Graph).                      |
| **Skema**    | **Kaku** (harus didefinisikan di awal). | **Fleksibel** (bisa berubah kapan saja).                  |
| **Relasi**   | Mendukung relasi kompleks (JOIN).       | Tidak dioptimalkan untuk relasi (biasanya denormalisasi). |
| **Contoh**   | MySQL, PostgreSQL, Oracle.              | MongoDB, Redis, Cassandra.                                |

---

## 4. Apa itu Middleware?

**Middleware** adalah kode atau perangkat lunak yang bertindak sebagai "jembatan" atau "penengah".

- **Dalam Web Development:** Middleware adalah fungsi yang dieksekusi di tengah-tengah siklus request-response HTTP. Ia berjalan **setelah** request diterima server tapi **sebelum** mencapai _handler_ utama (controller).
- **Fungsi Umum:**
  1.  **Autentikasi:** Memastikan user sudah login sebelum masuk ke halaman admin.
  2.  **Logging:** Mencatat data setiap request yang masuk.
  3.  **Parsing:** Mengubah body request menjadi format JSON.

5. Cara Menjalankan Project
   Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi (Backend & Frontend).

Backend (Server)
Masuk ke folder server lalu jalankan perintah berikut secara berurutan:
