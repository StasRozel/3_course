CREATE OR REPLACE PROCEDURE AddMaintenance(
    p_equipment_id IN NUMBER,
    p_maintenance_type IN NVARCHAR2,
    p_date_performed IN DATE,
    p_next_due_date IN DATE,
    p_cost IN NUMBER,
    p_notes IN CLOB
)
AS
BEGIN
    INSERT INTO Maintenance (equipment_id, maintenance_type, date_performed, next_due_date, cost, notes)
    VALUES (p_equipment_id, p_maintenance_type, p_date_performed, p_next_due_date, p_cost, p_notes);
    COMMIT;
END;
/