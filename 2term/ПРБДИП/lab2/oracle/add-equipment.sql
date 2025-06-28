CREATE OR REPLACE PROCEDURE AddEquipment(
    p_service_center_id IN NUMBER,
    p_name IN NVARCHAR2,
    p_type IN NVARCHAR2,
    p_serial_number IN NVARCHAR2,
    p_purchase_date IN DATE,
    p_current_location_id IN NUMBER,
    p_mileage IN NUMBER,
    p_fuel_consumption_rate IN NUMBER
)
AS
BEGIN
    INSERT INTO Equipment (service_center_id, name, type, serial_number, purchase_date, current_location_id, mileage, fuel_consumption_rate)
    VALUES (p_service_center_id, p_name, p_type, p_serial_number, p_purchase_date, p_current_location_id, p_mileage, p_fuel_consumption_rate);
    COMMIT;
END;
/