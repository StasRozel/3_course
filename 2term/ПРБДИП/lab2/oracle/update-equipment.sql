CREATE OR REPLACE PROCEDURE UpdateEquipment
(
    p_id IN NUMBER,
    p_service_center_id IN NUMBER DEFAULT NULL,
    p_name IN VARCHAR2 DEFAULT NULL,
    p_type IN VARCHAR2 DEFAULT NULL,
    p_serial_number IN VARCHAR2 DEFAULT NULL,
    p_purchase_date IN DATE DEFAULT NULL,
    p_current_location_id IN NUMBER DEFAULT NULL,
    p_mileage IN NUMBER DEFAULT NULL,
    p_fuel_consumption_rate IN NUMBER DEFAULT NULL
)
AS
BEGIN
    UPDATE Equipment
    SET
        service_center_id = NVL(p_service_center_id, service_center_id),
        name = NVL(p_name, name),
        type = NVL(p_type, type),
        serial_number = NVL(p_serial_number, serial_number),
        purchase_date = NVL(p_purchase_date, purchase_date),
        current_location_id = NVL(p_current_location_id, current_location_id),
        mileage = NVL(p_mileage, mileage),
        fuel_consumption_rate = NVL(p_fuel_consumption_rate, fuel_consumption_rate)
    WHERE id = p_id;
END UpdateEquipment;
/