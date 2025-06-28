----------------------------------------3----------------------------------------
WITH AggregatedRequests AS (
    SELECT
        YEAR(request_date) AS Year,
        CASE
            WHEN GROUPING(YEAR(request_date)) = 0 AND GROUPING(DATEPART(QUARTER, request_date)) = 1 AND GROUPING(MONTH(request_date)) = 1 THEN 'Year'
            WHEN GROUPING(DATEPART(QUARTER, request_date)) = 0 AND GROUPING(MONTH(request_date)) = 1 THEN 'Quarter'
            WHEN GROUPING(MONTH(request_date)) = 0 THEN 'Month'
            WHEN DATEPART(MONTH, request_date) <= 6 THEN 'First Half'
            ELSE 'Second Half'
            END AS PeriodType,
        CASE
            WHEN GROUPING(DATEPART(QUARTER, request_date)) = 0 THEN DATEPART(QUARTER, request_date)
            ELSE NULL
            END AS Quarter,
        CASE
            WHEN GROUPING(MONTH(request_date)) = 0 THEN MONTH(request_date)
            ELSE NULL
            END AS Month,
        COUNT(*) AS RequestCount
    FROM RepairRequests
    GROUP BY
        GROUPING SETS (
        (YEAR(request_date)),                          -- За год
        (YEAR(request_date), DATEPART(QUARTER, request_date)), -- За квартал
        (YEAR(request_date), MONTH(request_date)),     -- Помесячно
        (YEAR(request_date), CASE WHEN MONTH(request_date) <= 6 THEN 1 ELSE 2 END) -- За полгода
        )
)
SELECT *
FROM AggregatedRequests
ORDER BY
    Year,
    CASE
        WHEN PeriodType = 'Year' THEN 1
        WHEN PeriodType = 'First Half' THEN 2
        WHEN PeriodType = 'Second Half' THEN 3
        WHEN PeriodType = 'Quarter' THEN 4
        WHEN PeriodType = 'Month' THEN 5
        END,
    Quarter,
    Month;

----------------------------------------4----------------------------------------

DECLARE @StartDate DATE = '2025-01-01';
DECLARE @EndDate DATE = '2025-12-31';
DECLARE @EmployeeId INT = 1;

WITH AllResponseTimes AS (
    SELECT
        assigned_employee_id,
        equipment_id,
        DATEDIFF(DAY, request_date, completion_date) AS response_time_days
    FROM
        RepairRequests
    WHERE
        status = 'Готов'
      AND completion_date IS NOT NULL
      AND request_date BETWEEN @StartDate AND @EndDate
),

     AllSingleRequests AS (
         SELECT
             assigned_employee_id,
             equipment_id,
             COUNT(*) AS request_count
         FROM
             RepairRequests
         WHERE
             request_date BETWEEN @StartDate AND @EndDate
         GROUP BY
             assigned_employee_id, equipment_id
     ),

     GlobalStats AS (
         SELECT
             AVG(CAST(response_time_days AS FLOAT)) AS global_avg_response_time,
             (SELECT 100.0 * COUNT(*) FROM AllSingleRequests WHERE request_count = 1) /
             (SELECT COUNT(*) FROM AllSingleRequests) AS global_single_request_percentage
         FROM
             AllResponseTimes
     ),
-- Статистика по конкретному оператору
     EmployeeStats AS (
         SELECT
             @EmployeeId AS employee_id,
             AVG(CAST(response_time_days AS FLOAT)) AS employee_avg_response_time,
             (SELECT 100.0 * COUNT(*) FROM AllSingleRequests
              WHERE assigned_employee_id = @EmployeeId AND request_count = 1) /
             NULLIF((SELECT COUNT(*) FROM AllSingleRequests
                     WHERE assigned_employee_id = @EmployeeId), 0) AS employee_single_request_percentage
         FROM
             AllResponseTimes
         WHERE
             assigned_employee_id = @EmployeeId
     )

SELECT
    e.name AS 'Имя оператора',
    es.employee_avg_response_time AS 'Среднее время ответа (дни)',
    CASE
        WHEN gs.global_avg_response_time > 0
            THEN CAST((es.employee_avg_response_time / gs.global_avg_response_time * 100) AS DECIMAL(10,2))
        ELSE 0
        END AS 'Сравнение со средним временем (%)',
    CAST(es.employee_single_request_percentage AS DECIMAL(10,2)) AS 'Процент однократных обращений (%)',
    CASE
        WHEN gs.global_single_request_percentage > 0
            THEN CAST((es.employee_single_request_percentage / gs.global_single_request_percentage * 100) AS DECIMAL(10,2))
        ELSE 0
        END AS 'Сравнение с общим процентом однократных обращений (%)'
FROM
    EmployeeStats es
        CROSS JOIN
    GlobalStats gs
        JOIN
    Employees e ON e.id = @EmployeeId

----------------------------------------6----------------------------------------
WITH PagedResults AS (
    SELECT
        id,
        equipment_id,
        assigned_employee_id,
        request_date,
        problem_description,
        status,
        completion_date,
        ROW_NUMBER() OVER (ORDER BY request_date) AS RowNum
    FROM
        RepairRequests
)
SELECT
    id,
    equipment_id,
    assigned_employee_id,
    request_date,
    problem_description,
    status,
    completion_date
FROM
    PagedResults
WHERE
    RowNum BETWEEN 1 AND 5  -- Вторая страница (строки 21–40)
ORDER BY
    request_date;

INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (1, 1, '2025-03-01', N'Hydraulic failure', N'In progress', NULL); -- Дубликат записи с id=1

----------------------------------------7----------------------------------------
SELECT
    e.id AS EmployeeId,
    e.name AS EmployeeName,
    COALESCE(SUM(CASE WHEN MONTH(r.request_date) = MONTH(DATEADD(MONTH, -3, GETDATE())) AND YEAR(r.request_date) = YEAR(DATEADD(MONTH, -3, GETDATE())) THEN 1 ELSE 0 END), 0) AS MonthMinus3,
    COALESCE(SUM(CASE WHEN MONTH(r.request_date) = MONTH(DATEADD(MONTH, -2, GETDATE())) AND YEAR(r.request_date) = YEAR(DATEADD(MONTH, -2, GETDATE())) THEN 1 ELSE 0 END), 0) AS MonthMinus2,
    COALESCE(SUM(CASE WHEN MONTH(r.request_date) = MONTH(DATEADD(MONTH, -1, GETDATE())) AND YEAR(r.request_date) = YEAR(DATEADD(MONTH, -1, GETDATE())) THEN 1 ELSE 0 END), 0) AS MonthMinus1,
    COALESCE(SUM(CASE WHEN MONTH(r.request_date) = MONTH(GETDATE()) AND YEAR(r.request_date) = YEAR(GETDATE()) THEN 1 ELSE 0 END), 0) AS CurrentMonth
FROM
    Employees e
        LEFT JOIN
    RepairRequests r ON e.id = r.assigned_employee_id
        AND r.request_date >= DATEADD(MONTH, -4, GETDATE())
        AND r.request_date < GETDATE()
GROUP BY
    e.id, e.name
ORDER BY
    e.id;

SELECT DISTINCT
    equipment_id AS ClientEquipmentId,
    assigned_employee_id AS EmployeeId,
    EmployeeName,
    RequestCount AS MaxRequestCount
FROM (
         SELECT
             r.equipment_id,
             r.assigned_employee_id,
             e.name AS EmployeeName,
             COUNT(*) AS RequestCount,
             RANK() OVER (PARTITION BY r.equipment_id ORDER BY COUNT(*) DESC) AS RequestRank
         FROM
             RepairRequests r
                 JOIN
             Employees e ON r.assigned_employee_id = e.id
         GROUP BY
             r.equipment_id,
             r.assigned_employee_id,
             e.name
     ) AS ranked
WHERE
    RequestRank = 1
ORDER BY
    ClientEquipmentId;