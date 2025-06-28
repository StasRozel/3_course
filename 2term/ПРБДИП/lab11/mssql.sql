CREATE FUNCTION dbo.fn_GetTasksByDate(
    @StartDate DATE,
    @EndDate DATE
)
    RETURNS TABLE
        AS
        RETURN(SELECT t.id,
                      t.repair_request_id,
                      t.assigned_employee_id,
                      e.name AS employee_name,
                      t.task_description,
                      t.task_date,
                      t.estimated_hours,
                      t.status
               FROM Tasks t
                        JOIN Employees e ON t.assigned_employee_id = e.id
               WHERE t.task_date BETWEEN @StartDate AND @EndDate);

CREATE FUNCTION dbo.fn_GetClientsByDate(
    @StartDate DATE,
    @EndDate DATE
)
    RETURNS TABLE
        AS
        RETURN(SELECT id,
                      name,
                      contact_info,
                      registration_date,
                      loyalty_points
               FROM Clients
               WHERE registration_date BETWEEN @StartDate AND @EndDate);
SELECT *
FROM dbo.fn_GetTasksByDate('2025-01-01', '2025-12-31');

SELECT *
FROM dbo.fn_GetClientsByDate('2025-01-01', '2025-12-31');

truncate table Clients;