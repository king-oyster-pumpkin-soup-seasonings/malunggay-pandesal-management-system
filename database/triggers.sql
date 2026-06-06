CREATE OR REPLACE FUNCTION log_production()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO production_logs (product_id, quantity)
    VALUES (NEW.product_id, NEW.quantity);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER production_insert_trigger
AFTER INSERT ON production
FOR EACH ROW
EXECUTE FUNCTION log_production();
