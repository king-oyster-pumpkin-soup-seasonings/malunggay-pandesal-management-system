# *Malunggay pandesal tag dos ra malamion ug masustansya pa!*

###### palit namo!

##### sanaol!

#### papap dol!

### ayaw kol!

#### bata pako kol!

![malunggay pandesal](/public/pandesal.jpg)

**Malunggay Pandesal Management System** is web-based management system for handling malunggay pandesal products, ingredients, recipes, and production records. The application is built with Next.js, React, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- Manage bakery products.
- Manage ingredients.
- Create, update, and delete recipe items for each product.
- Record production batches by product and quantity.
- View production history with timestamps.
- Use seeded sample data for common pandesal products and ingredients.
- Test the database connection through an API route.
- View a simple slides page for presenting the system stack, ERD, trigger, and stored procedure.

## Screenshots

![Home Page](/public/ss_1.jpg)

![Adding a product](/public/ss_2.jpg)

![Viewing a recipe](/public/ss_3.jpg)


## Tech Stack

- **Framework:** Next.js 16
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL
- **Database Driver:** pg
- **Package Manager:** pnpm

## Main Pages

| Page | Route | Description |
| --- | --- | --- |
| Home | `/` | Landing page for the system. |
| Products | `/products` | Add, edit, delete, and view products. |
| Ingredients | `/ingredients` | Add, edit, delete, and view ingredients. |
| Recipes | `/recipes` | Select a product and manage its recipe ingredients and quantities. |
| Production | `/production` | Add, edit, delete, and view production records. |
| Slides | `/slides` | Presentation slides for the tech stack, ERD, trigger, and stored procedure. |

## Database Design

The PostgreSQL database contains the following tables:

| Table | Purpose |
| --- | --- |
| `products` | Stores product names such as Malunggay Pandesal, Classic Pandesal, and other variants. |
| `ingredients` | Stores available ingredients such as flour, water, yeast, sugar, butter, and malunggay leaves. |
| `recipes` | Connects products to ingredients and stores the required quantity for each ingredient. |
| `production` | Stores production batch records with product, quantity, and production timestamp. |
| `production_logs` | Stores logs created when production records are inserted. |

Relationships:

- A product can have many recipe items.
- An ingredient can be used in many recipes.
- A recipe item belongs to one product and one ingredient.
- A production record belongs to one product.
- Deleting a product also deletes its related recipes and production records through cascading foreign keys.
- Deleting an ingredient also deletes its related recipe items through cascading foreign keys.

## Database Files

| File | Description |
| --- | --- |
| `database/schema.sql` | Creates the database tables and relationships. |
| `database/seed.sql` | Inserts sample products, ingredients, and recipe data. |
| `database/triggers.sql` | Creates a trigger that logs inserted production records. |
| `database/procedures.sql` | Creates a stored procedure for inserting production records. |

## API Routes

| Endpoint | Methods | Description |
| --- | --- | --- |
| `/api/products` | `GET`, `POST`, `PATCH`, `DELETE` | Manage products. |
| `/api/ingredients` | `GET`, `POST`, `PUT`, `DELETE` | Manage ingredients. |
| `/api/recipes` | `GET`, `POST`, `PUT`, `DELETE` | Manage recipe items. Supports filtering by `product_id`. |
| `/api/production` | `GET`, `POST`, `PUT`, `DELETE` | Manage production records. |
| `/api/test-db` | `GET` | Tests the PostgreSQL connection with `SELECT 1`. |

## Environment Variables

Create a `.env.local` file in the project root and add your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

Replace `username`, `password`, and `database_name` with your local PostgreSQL credentials.

## Installation

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open the application in your browser:

```text
http://localhost:3000
```

Build the application:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

Run linting (*):

```bash
pnpm lint
```

## Database Setup

Create a PostgreSQL database, then run the SQL files in this order:

```bash
psql -d your_database_name -f database/schema.sql
psql -d your_database_name -f database/seed.sql
psql -d your_database_name -f database/triggers.sql
psql -d your_database_name -f database/procedures.sql
```

After setup, you can verify the connection by visiting:

```text
http://localhost:3000/api/test-db
```

Expected response:

```json
{
  "success": true,
  "rows": [
    {
      "?column?": 1
    }
  ]
}
```

## Project Structure

```text
.
├── database/
│   ├── procedures.sql
│   ├── schema.sql
│   ├── seed.sql
│   └── triggers.sql
├── public/
│   ├── erd-hd.png
│   ├── malunggay-pandesal-vehicle-pixel.png
│   ├── pandesal.jpg
│   ├── ss_1.jpg
│   ├── ss_2.jpg
│   └── ss_3.jpg
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── ingredients/
│   │   ├── production/
│   │   ├── products/
│   │   ├── recipes/
│   │   └── slides/
│   ├── components/
│   └── library/
│       └── database/
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Application Flow

1. Add products in the Products page.
2. Add ingredients in the Ingredients page.
3. Open the Recipes page, select a product, then assign ingredients and quantities.
4. Open the Production page and record produced quantities for each product.
5. Production inserts can be logged through the database trigger when `database/triggers.sql` is installed.

## Notes

- Product and ingredient names are limited to 67 characters in the database.
- Recipe quantities and production quantities must be greater than zero.
- Recipe entries are unique by product and ingredient, so the same ingredient cannot be duplicated for the same product.
- The system currently does not include authentication or user roles.
- The app depends on a working PostgreSQL connection through `DATABASE_URL`.

