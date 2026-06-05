CREATE OR REPLACE PROCEDURE create_production(
    p_product_id INTEGER,
    p_quantity INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO production (product_id, quantity)
    VALUES (p_product_id, p_quantity);
END;
$$;