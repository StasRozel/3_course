CREATE PROCEDURE AddEquipment
    @service_center_id INT,
    @name NVARCHAR(255),
    @type NVARCHAR(100),
    @serial_number NVARCHAR(100),
    @purchase_date DATE,
    @current_location_id INT,
    @mileage INT,
    @fuel_consumption_rate DECIMAL(10, 2)
AS
BEGIN
    INSERT INTO Equipment (service_center_id, name, type, serial_number, purchase_date, current_location_id, mileage, fuel_consumption_rate)
    VALUES (@service_center_id, @name, @type, @serial_number, @purchase_date, @current_location_id, @mileage, @fuel_consumption_rate);
END;