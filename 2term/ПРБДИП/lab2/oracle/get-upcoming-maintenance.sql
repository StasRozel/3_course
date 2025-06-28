CREATE OR REPLACE PROCEDURE GetUpcomingMaintenance
(
    p_Period IN VARCHAR2
)
AS
    v_Today DATE := SYSDATE;
BEGIN
    SELECT 
        e.name AS EquipmentName,
        m.next_due_date AS NextDueDate,
        m.maintenance_type AS MaintenanceType,
        m.cost AS Cost,
        m.notes AS Notes
    FROM Maintenance m
    JOIN Equipment e ON m.equipment_id = e.id
    WHERE m.next_due_date >= v_Today
    AND (
        (p_Period = 'Today' AND TRUNC(m.next_due_date) = TRUNC(v_Today))
        OR (p_Period = 'Week' AND m.next_due_date BETWEEN v_Today AND v_Today + 7)
        OR (p_Period = 'Month' AND m.next_due_date BETWEEN v_Today AND ADD_MONTHS(v_Today, 1))
    )
    ORDER BY m.next_due_date;
END GetUpcomingMaintenance;
/