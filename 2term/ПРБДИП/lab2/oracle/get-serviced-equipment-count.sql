CREATE OR REPLACE FUNCTION GetServicedEquipmentCount
(
    p_start_date IN DATE,
    p_end_date IN DATE
)
RETURN NUMBER
AS
    v_serviced_count NUMBER;
BEGIN
    SELECT COUNT(DISTINCT equipment_id) INTO v_serviced_count
    FROM Maintenance
    WHERE date_performed BETWEEN p_start_date AND p_end_date;

    RETURN NVL(v_serviced_count, 0);
END GetServicedEquipmentCount;
/