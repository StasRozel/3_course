CREATE PROCEDURE UpdateEquipment
    @id INT,
    @service_center_id INT = NULL,
    @name NVARCHAR(255) = NULL,
    @type NVARCHAR(100) = NULL,
    @serial_number NVARCHAR(100) = NULL,
    @purchase_date DATE = NULL,
    @current_location_id INT = NULL,
    @mileage INT = NULL,
    @fuel_consumption_rate DECIMAL(10, 2) = NULL
AS
BEGIN
    UPDATE Equipment
    SET
        service_center_id = ISNULL(@service_center_id, service_center_id),
        name = ISNULL(@name, name),
        type = ISNULL(@type, type),
        serial_number = ISNULL(@serial_number, serial_number),
        purchase_date = ISNULL(@purchase_date, purchase_date),
        current_location_id = ISNULL(@current_location_id, current_location_id),
        mileage = ISNULL(@mileage, mileage),
        fuel_consumption_rate = ISNULL(@fuel_consumption_rate, fuel_consumption_rate)
    WHERE id = @id;
END;