# CMA DOKUI1 — Système Complet de Gestion d'Église

## Ce que contient ce système

| Module | Description |
|---|---|
| 👥 Membres | Fiche complète, statut, famille, photo |
| 🏛️ Départements | Culte, Jeunesse, Femmes, Hommes, Enfants, Louange... |
| ✝️ Actes pastoraux | Mariages, Baptêmes, Funérailles, Dédicaces |
| ⛪ Cultes & Programmes | Planning, bulletin imprimable |
| ✅ Présences | Feuille de présence par culte |
| 🎉 Événements | Retraites, conférences, camps, calendrier |
| 💰 Finances | Offrandes, dépenses, dons |
| 💎 Dîmes | Suivi mensuel nominatif par membre |
| 📊 Budgets | Planification par département |
| 👤 Utilisateurs | Rôles : Super Admin, Admin, Pasteur, Secrétaire, Trésorier, Lecteur |

## Installation (base vide)

### 1. Vider la base dans phpMyAdmin
```sql
DROP DATABASE IF EXISTS dokui_cma;
CREATE DATABASE dokui_cma CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configurer .env
```
DATABASE_URL="mysql://root:@localhost:3306/dokui_cma"
```

### 3. Installer et migrer
```bash
npm install
npx prisma migrate deploy
npm run dev
```

## Connexion admin par défaut
- Email : admin@cma-dokui1.ci
- Mot de passe : admin123

## Rôles disponibles
| Rôle | Accès |
|---|---|
| SUPER_ADMIN | Tout |
| ADMIN | Tout sauf paramètres système |
| PASTEUR | Lecture + Membres + Actes + Stats |
| SECRETAIRE | Membres, Cultes, Programmes, Présences, Annonces |
| TRESORIER | Finances, Dîmes, Budgets uniquement |
| LECTEUR | Consultation uniquement |
