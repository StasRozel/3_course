CREATE PROCEDURE AddPart
    @equipment_id INT,
    @name NVARCHAR(255),
    @part_number NVARCHAR(100),
    @quantity INT,
    @price DECIMAL(10, 2),
    @supplier NVARCHAR(255),
    @last_restock_date DATE
AS
BEGIN
    INSERT INTO Parts (equipment_id, name, part_number, quantity, price, supplier, last_restock_date)
    VALUES (@equipment_id, @name, @part_number, @quantity, @price, @supplier, @last_restock_date);
END;