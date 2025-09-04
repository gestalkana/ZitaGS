

# 📦 Application de Gestion de Stock

Une application web de gestion des stocks développée en **Laravel 10**, utilisant **PostgreSQL** comme base de données, et déployée avec **Docker** (Nginx + PHP-FPM).

---

## 🚀 Fonctionnalités principales

* Gestion des produits 🛒
* Gestion des entrées et sorties de stock 📥📤
* Attribution de lots aux produits par entrepôt 🏬
* Génération automatique des numéros de bons de sortie (par mois) 🧾
* Gestion multi-entrepôts 🔄
* Interface moderne avec **SweetAlert2** ⚡

---

## ⚙️ Dépendances

Avant de lancer le projet, assurez-vous d’avoir installé :

* [Docker](https://www.docker.com/) ≥ 20.10
* [Docker Compose](https://docs.docker.com/compose/) ≥ 1.29
* [Git](https://git-scm.com/) ≥ 2.30

Toutes les autres dépendances (PHP, Composer, Nginx, PostgreSQL) sont déjà gérées par **Docker** via `docker-compose.yml`.

---

## 📂 Installation & Lancement

1. **Cloner le projet**

   ```bash
   git clone https://github.com/ton-repo/gestion-stock.git
   cd gestion-stock
   ```

2. **Créer ton fichier `.env`** (copie du `.env.example`)

   ```bash
   cp .env.example .env
   ```

   Exemple de configuration DB pour PostgreSQL :

   ```env
   DB_CONNECTION=pgsql
   DB_HOST=db
   DB_PORT=5432
   DB_DATABASE=laravel
   DB_USERNAME=laravel
   DB_PASSWORD=secret
   ```

3. **Lancer Docker**

   ```bash
   docker-compose up -d --build
   ```

4. **Installer les dépendances Laravel** (dans le conteneur `app`)

   ```bash
   docker exec -it laravel_app composer install
   docker exec -it laravel_app php artisan key:generate
   docker exec -it laravel_app php artisan migrate --seed
   ```

5. **Accéder à l’application**
   👉 [http://localhost:8000](http://localhost:8000)

---

## 🐳 Services Docker

* **laravel\_app** → Application Laravel (PHP-FPM + Composer)
* **laravel\_nginx** → Serveur Nginx (port 8000)
* **laravel\_db** → PostgreSQL 17.5 (port 5432, données persistantes)

---

## 🔧 Commandes utiles

* Logs Laravel

  ```bash
  docker exec -it laravel_app tail -f storage/logs/laravel.log
  ```

* Exécuter des migrations

  ```bash
  docker exec -it laravel_app php artisan migrate
  ```

* Installer une nouvelle dépendance Laravel

  ```bash
  docker exec -it laravel_app composer require vendor/package
  ```

---

## 📜 Licence

Projet développé par **Gabriel Indriantsilazo Andriamahafaly** 
INDRIANTSILAZO Andriamahafaly Gabriel
👨‍💻 Lead Développeur – Zita Company

