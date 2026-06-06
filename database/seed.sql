BEGIN;

-- Ingredients
INSERT INTO ingredients (ingredient_name) VALUES
	('All-Purpose Flour'),
	('Bread Flour'),
	('Water'),
	('Instant Yeast'),
	('Sugar'),
	('Salt'),
	('Butter'),
	('Milk'),
	('Egg'),
	('Malunggay Leaves'),
	('Cheese'),
	('Garlic'),
	('Ube (Purple Yam)'),
	('Pumpkin'),
	('Sesame Seeds'),
	('Vegetable Oil')
ON CONFLICT (ingredient_name) DO NOTHING;

-- Products
INSERT INTO products (product_name) VALUES
	('Malunggay Pandesal'),
	('Classic Pandesal'),
	('Cheese Pandesal'),
	('Ube Pandesal'),
	('Pumpkin Pandesal'),
	('Garlic Pandesal'),
	('Sesame Pandesal')
ON CONFLICT (product_name) DO NOTHING;

-- Recipes (product -> ingredient -> quantity (units arbitrary, e.g., grams or pieces))
-- Malunggay Pandesal
INSERT INTO recipes (product_id, ingredient_id, quantity) VALUES
	((SELECT id FROM products WHERE product_name='Malunggay Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Bread Flour'), 500),
	((SELECT id FROM products WHERE product_name='Malunggay Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Water'), 300),
	((SELECT id FROM products WHERE product_name='Malunggay Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Instant Yeast'), 7),
	((SELECT id FROM products WHERE product_name='Malunggay Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Sugar'), 30),
	((SELECT id FROM products WHERE product_name='Malunggay Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Salt'), 8),
	((SELECT id FROM products WHERE product_name='Malunggay Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Butter'), 50),
	((SELECT id FROM products WHERE product_name='Malunggay Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Malunggay Leaves'), 40)
ON CONFLICT DO NOTHING;

-- Classic Pandesal
INSERT INTO recipes (product_id, ingredient_id, quantity) VALUES
	((SELECT id FROM products WHERE product_name='Classic Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='All-Purpose Flour'), 500),
	((SELECT id FROM products WHERE product_name='Classic Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Water'), 300),
	((SELECT id FROM products WHERE product_name='Classic Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Instant Yeast'), 7),
	((SELECT id FROM products WHERE product_name='Classic Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Sugar'), 40),
	((SELECT id FROM products WHERE product_name='Classic Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Salt'), 8),
	((SELECT id FROM products WHERE product_name='Classic Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Butter'), 60)
ON CONFLICT DO NOTHING;

-- Cheese Pandesal
INSERT INTO recipes (product_id, ingredient_id, quantity) VALUES
	((SELECT id FROM products WHERE product_name='Cheese Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Bread Flour'), 480),
	((SELECT id FROM products WHERE product_name='Cheese Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Water'), 290),
	((SELECT id FROM products WHERE product_name='Cheese Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Instant Yeast'), 7),
	((SELECT id FROM products WHERE product_name='Cheese Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Sugar'), 25),
	((SELECT id FROM products WHERE product_name='Cheese Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Salt'), 8),
	((SELECT id FROM products WHERE product_name='Cheese Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Cheese'), 120),
	((SELECT id FROM products WHERE product_name='Cheese Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Butter'), 40)
ON CONFLICT DO NOTHING;

-- Ube Pandesal
INSERT INTO recipes (product_id, ingredient_id, quantity) VALUES
	((SELECT id FROM products WHERE product_name='Ube Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='All-Purpose Flour'), 450),
	((SELECT id FROM products WHERE product_name='Ube Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Ube (Purple Yam)'), 150),
	((SELECT id FROM products WHERE product_name='Ube Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Water'), 260),
	((SELECT id FROM products WHERE product_name='Ube Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Instant Yeast'), 7),
	((SELECT id FROM products WHERE product_name='Ube Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Sugar'), 30),
	((SELECT id FROM products WHERE product_name='Ube Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Butter'), 40)
ON CONFLICT DO NOTHING;

-- Pumpkin Pandesal
INSERT INTO recipes (product_id, ingredient_id, quantity) VALUES
	((SELECT id FROM products WHERE product_name='Pumpkin Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='All-Purpose Flour'), 450),
	((SELECT id FROM products WHERE product_name='Pumpkin Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Pumpkin'), 140),
	((SELECT id FROM products WHERE product_name='Pumpkin Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Water'), 270),
	((SELECT id FROM products WHERE product_name='Pumpkin Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Instant Yeast'), 7),
	((SELECT id FROM products WHERE product_name='Pumpkin Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Sugar'), 25),
	((SELECT id FROM products WHERE product_name='Pumpkin Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Butter'), 45)
ON CONFLICT DO NOTHING;

-- Garlic Pandesal
INSERT INTO recipes (product_id, ingredient_id, quantity) VALUES
	((SELECT id FROM products WHERE product_name='Garlic Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='All-Purpose Flour'), 480),
	((SELECT id FROM products WHERE product_name='Garlic Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Garlic'), 40),
	((SELECT id FROM products WHERE product_name='Garlic Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Vegetable Oil'), 30),
	((SELECT id FROM products WHERE product_name='Garlic Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Instant Yeast'), 7),
	((SELECT id FROM products WHERE product_name='Garlic Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Salt'), 8)
ON CONFLICT DO NOTHING;

-- Sesame Pandesal
INSERT INTO recipes (product_id, ingredient_id, quantity) VALUES
	((SELECT id FROM products WHERE product_name='Sesame Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Bread Flour'), 500),
	((SELECT id FROM products WHERE product_name='Sesame Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Water'), 300),
	((SELECT id FROM products WHERE product_name='Sesame Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Instant Yeast'), 7),
	((SELECT id FROM products WHERE product_name='Sesame Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Sugar'), 30),
	((SELECT id FROM products WHERE product_name='Sesame Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Sesame Seeds'), 20),
	((SELECT id FROM products WHERE product_name='Sesame Pandesal'), (SELECT id FROM ingredients WHERE ingredient_name='Butter'), 50)
ON CONFLICT DO NOTHING;

COMMIT;
