CREATE PROCEDURE AddMaintenance
    @equipment_id INT,
    @maintenance_type NVARCHAR(100),
    @date_performed DATE,
    @next_due_date DATE,
    @cost DECIMAL(10, 2),
    @notes TEXT
AS
BEGIN
    INSERT INTO Maintenance (equipment_id, maintenance_type, date_performed, next_due_date, cost, notes)
    VALUES (@equipment_id, @maintenance_type, @date_performed, @next_due_date, @cost, @notes);
END;