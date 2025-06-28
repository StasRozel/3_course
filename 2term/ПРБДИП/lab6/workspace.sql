------------------------------3--------------------------------
WITH AggregatedRequests AS (
    SELECT
        EXTRACT(YEAR FROM request_date) AS Year,
        CASE
            WHEN GROUPING(EXTRACT(YEAR FROM request_date)) = 0 AND GROUPING(TO_CHAR(request_date, 'Q')) = 1 AND GROUPING(EXTRACT(MONTH FROM request_date)) = 1 THEN 'Year'
            WHEN GROUPING(TO_CHAR(request_date, 'Q')) = 0 AND GROUPING(EXTRACT(MONTH FROM request_date)) = 1 THEN 'Quarter'
            WHEN GROUPING(EXTRACT(MONTH FROM request_date)) = 0 THEN 'Month'
            WHEN EXTRACT(MONTH FROM request_date) <= 6 THEN 'First Half'
            ELSE 'Second Half'
            END AS PeriodType,
        CASE
            WHEN GROUPING(TO_CHAR(request_date, 'Q')) = 0 THEN TO_NUMBER(TO_CHAR(request_date, 'Q'))
            ELSE NULL
            END AS Quarter,
        CASE
            WHEN GROUPING(EXTRACT(MONTH FROM request_date)) = 0 THEN EXTRACT(MONTH FROM request_date)
            ELSE NULL
            END AS Month,
        COUNT(*) AS RequestCount
    FROM RepairRequests
    GROUP BY
        GROUPING SETS (
        (EXTRACT(YEAR FROM request_date)),                             -- За год
        (EXTRACT(YEAR FROM request_date), TO_CHAR(request_date, 'Q')), -- За квартал
        (EXTRACT(YEAR FROM request_date), EXTRACT(MONTH FROM request_date)), -- Помесячно
        (EXTRACT(YEAR FROM request_date),
         CASE WHEN EXTRACT(MONTH FROM request_date) <= 6 THEN 1 ELSE 2 END) -- За полгода
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

------------------------------4--------------------------------

WITH
    params AS (
        SELECT
            TO_DATE('2025-01-01', 'YYYY-MM-DD') AS StartDate,
            TO_DATE('2025-12-31', 'YYYY-MM-DD') AS EndDate,
            1 AS EmployeeId
        FROM dual
    ),
    -- Расчет среднего времени ответа по всем запросам
    GlobalResponseTime AS (
        SELECT
            AVG(completion_date - request_date) AS global_avg_response_time
        FROM
            RepairRequests
        WHERE
            status = 'Готов'
          AND completion_date IS NOT NULL
          AND request_date BETWEEN (SELECT StartDate FROM params) AND (SELECT EndDate FROM params)
    ),
    -- Расчет среднего времени ответа по конкретному сотруднику
    EmployeeResponseTime AS (
        SELECT
            AVG(completion_date - request_date) AS employee_avg_response_time
        FROM
            RepairRequests
        WHERE
            status = 'Готов'
          AND completion_date IS NOT NULL
          AND request_date BETWEEN (SELECT StartDate FROM params) AND (SELECT EndDate FROM params)
          AND assigned_employee_id = (SELECT EmployeeId FROM params)
    ),
    -- Общее количество оборудования
    AllEquipmentCount AS (
        SELECT
            COUNT(DISTINCT equipment_id) AS total_equipment_count
        FROM
            RepairRequests
        WHERE
            request_date BETWEEN (SELECT StartDate FROM params) AND (SELECT EndDate FROM params)
    ),
    -- Количество оборудования с однократными обращениями (глобально)
    SingleRequestEquipment AS (
        SELECT
            COUNT(*) AS single_request_count
        FROM (
                 SELECT
                     equipment_id
                 FROM
                     RepairRequests
                 WHERE
                     request_date BETWEEN (SELECT StartDate FROM params) AND (SELECT EndDate FROM params)
                 GROUP BY
                     equipment_id
                 HAVING
                     COUNT(*) = 1
             )
    ),
    -- Количество оборудования, обслуживаемого сотрудником
    EmployeeEquipmentCount AS (
        SELECT
            COUNT(DISTINCT equipment_id) AS emp_equipment_count
        FROM
            RepairRequests
        WHERE
            request_date BETWEEN (SELECT StartDate FROM params) AND (SELECT EndDate FROM params)
          AND assigned_employee_id = (SELECT EmployeeId FROM params)
    ),
    -- Количество оборудования с однократными обращениями к сотруднику
    EmployeeSingleRequestEquipment AS (
        SELECT
            COUNT(*) AS emp_single_request_count
        FROM (
                 SELECT
                     equipment_id
                 FROM
                     RepairRequests
                 WHERE
                     request_date BETWEEN (SELECT StartDate FROM params) AND (SELECT EndDate FROM params)
                   AND assigned_employee_id = (SELECT EmployeeId FROM params)
                 GROUP BY
                     equipment_id
                 HAVING
                     COUNT(*) = 1
             )
    )
SELECT
    e.name AS "Имя оператора",
    ert.employee_avg_response_time AS "Среднее время ответа (дни)",
    CASE
        WHEN grt.global_avg_response_time > 0
            THEN ROUND((ert.employee_avg_response_time / grt.global_avg_response_time * 100), 2)
        ELSE 0
        END AS "Сравнение со средним временем (%)",
    CASE
        WHEN eec.emp_equipment_count > 0
            THEN ROUND((esre.emp_single_request_count / eec.emp_equipment_count * 100), 2)
        ELSE 0
        END AS "Процент однократных обращений (%)",
    CASE
        WHEN (aec.total_equipment_count > 0) AND (sre.single_request_count / aec.total_equipment_count > 0)
            THEN ROUND(((esre.emp_single_request_count / NULLIF(eec.emp_equipment_count, 0)) /
                        (sre.single_request_count / aec.total_equipment_count) * 100), 2)
        ELSE 0
        END AS "Сравнение с общим процентом однократных обращений (%)"
FROM
    Employees e,
    GlobalResponseTime grt,
    EmployeeResponseTime ert,
    AllEquipmentCount aec,
    SingleRequestEquipment sre,
    EmployeeEquipmentCount eec,
    EmployeeSingleRequestEquipment esre
WHERE
    e.id = (SELECT EmployeeId FROM params);

------------------------------5--------------------------------

-- Постраничная выборка
WITH PagedResults AS (
    SELECT
        id,
        equipment_id,
        assigned_employee_id,
        request_date,
        problem_description,
        status,
        completion_date,
        ROW_NUMBER() OVER (ORDER BY request_date)
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
            RowNum BETWEEN 1 AND 5
ORDER BY
    request_date;

SELECT * FROM REPAIRREQUESTS;


-- Статистика по сотрудникам за последние месяцы
SELECT
    e.id AS EmployeeId,
    e.name AS EmployeeName,
    NVL(SUM(CASE WHEN EXTRACT(MONTH FROM r.request_date) = EXTRACT(MONTH FROM ADD_MONTHS(SYSDATE, -3))
        AND EXTRACT(YEAR FROM r.request_date) = EXTRACT(YEAR FROM ADD_MONTHS(SYSDATE, -3)) THEN 1 ELSE 0 END), 0) AS MonthMinus3,
    NVL(SUM(CASE WHEN EXTRACT(MONTH FROM r.request_date) = EXTRACT(MONTH FROM ADD_MONTHS(SYSDATE, -2))
        AND EXTRACT(YEAR FROM r.request_date) = EXTRACT(YEAR FROM ADD_MONTHS(SYSDATE, -2)) THEN 1 ELSE 0 END), 0) AS MonthMinus2,
    NVL(SUM(CASE WHEN EXTRACT(MONTH FROM r.request_date) = EXTRACT(MONTH FROM ADD_MONTHS(SYSDATE, -1))
        AND EXTRACT(YEAR FROM r.request_date) = EXTRACT(YEAR FROM ADD_MONTHS(SYSDATE, -1)) THEN 1 ELSE 0 END), 0) AS MonthMinus1,
    NVL(SUM(CASE WHEN EXTRACT(MONTH FROM r.request_date) = EXTRACT(MONTH FROM SYSDATE)
        AND EXTRACT(YEAR FROM r.request_date) = EXTRACT(YEAR FROM SYSDATE) THEN 1 ELSE 0 END), 0) AS CurrentMonth
FROM
    Employees e
        LEFT JOIN
    RepairRequests r ON e.id = r.assigned_employee_id
        AND r.request_date >= ADD_MONTHS(SYSDATE, -4)
        AND r.request_date < SYSDATE
GROUP BY
    e.id, e.name
ORDER BY
    e.id;

-- Максимальное количество запросов
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
     ) ranked
WHERE
    RequestRank = 1
ORDER BY
    ClientEquipmentId;

SELECT * FROM EQUIPMENT;