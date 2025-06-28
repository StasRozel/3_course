CREATE FUNCTION GetServicedEquipmentCount
(
    @start_date DATE,
    @end_date DATE
)
RETURNS INT
AS
BEGIN
    DECLARE @serviced_count INT;

    SELECT @serviced_count = COUNT(DISTINCT equipment_id)
    FROM Maintenance
    WHERE date_performed BETWEEN @start_date AND @end_date;

    RETURN ISNULL(@serviced_count, 0);
END;