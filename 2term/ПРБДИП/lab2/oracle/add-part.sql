CREATE OR REPLACE PROCEDURE AddPart(
    p_equipment_id IN NUMBER,
    p_name IN NVARCHAR2,
    p_part_number IN NVARCHAR2,
    p_quantity IN NUMBER,
    p_price IN NUMBER,
    p_supplier IN NVARCHAR2,
    p_last_restock_date IN DATE
)
AS
BEGIN
    INSERT INTO Parts (equipment_id, name, part_number, quantity, price, supplier, last_restock_date)
    VALUES (p_equipment_id, p_name, p_part_number, p_quantity, p_price, p_supplier, p_last_restock_date);
    COMMIT;
END;
/