-- Создадим представление для агрегации данных о выполненных кейсах по датам и сотрудникам
CREATE OR REPLACE VIEW EmployeeCasesPerDay AS
SELECT
    assigned_employee_id,
    completion_date as work_date,
    COUNT(*) as completed_cases
FROM
    RepairRequests
WHERE
    status = 'Готов'
  AND completion_date IS NOT NULL
GROUP BY
    assigned_employee_id, completion_date
ORDER BY
    assigned_employee_id, completion_date;


select * from REPAIRREQUESTS;
-- Исправленный запрос MATCH_RECOGNIZE
SELECT
    e.name AS employee_name,
    m.pattern_start_date,
    m.pattern_end_date,
    m.initial_cases,
    m.peak_cases,
    m.final_cases
FROM (
         SELECT *
         FROM EmployeeCasesPerDay
                  MATCH_RECOGNIZE (
                      PARTITION BY assigned_employee_id
                      ORDER BY work_date
                      MEASURES
                          FIRST(work_date) AS pattern_start_date,
                          LAST(work_date) AS pattern_end_date,
                          FIRST(completed_cases) AS initial_cases,
                          MAX(C.completed_cases) AS peak_cases,
                          LAST(completed_cases) AS final_cases,
                          MATCH_NUMBER() AS match_num,
                          assigned_employee_id AS employee_id
                      ONE ROW PER MATCH
                      PATTERN (A B C D)
                      DEFINE
                          A AS 1=1,
                          B AS B.completed_cases < A.completed_cases,
                          C AS C.completed_cases > B.completed_cases,
                          D AS D.completed_cases < C.completed_cases
                      )
     ) m
         JOIN Employees e ON m.employee_id = e.id
ORDER BY e.name, m.pattern_start_date;