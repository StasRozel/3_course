CREATE PROCEDURE GetUpcomingMaintenance
    @Period NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Today DATE = GETDATE();

    SELECT 
        e.name AS EquipmentName,
        m.next_due_date AS NextDueDate,
        m.maintenance_type AS MaintenanceType,
        m.cost AS Cost,
        m.notes AS Notes
    FROM Maintenance m
    JOIN Equipment e ON m.equipment_id = e.id
    WHERE m.next_due_date >= @Today
    AND (
        (@Period = 'Today' AND m.next_due_date = @Today)
        OR (@Period = 'Week' AND m.next_due_date BETWEEN @Today AND DATEADD(day, 7, @Today))
        OR (@Period = 'Month' AND m.next_due_date BETWEEN @Today AND DATEADD(month, 1, @Today))
    )
    ORDER BY m.next_due_date;
END