WITH CompletedCases AS (
    SELECT
        e.id AS employee_id,
        e.name,
        e.department,
        e.salary,
        COUNT(r.id) AS case_count,
        AVG(COUNT(r.id)) OVER (PARTITION BY e.department) AS dept_avg_cases
    FROM
        Employees e
            LEFT JOIN
        RepairRequests r ON e.id = r.assigned_employee_id
            AND r.status = 'Готов'
            AND r.completion_date IS NOT NULL
            AND r.request_date BETWEEN TO_DATE('2025-01-01', 'YYYY-MM-DD') AND TO_DATE('2025-12-31', 'YYYY-MM-DD')
    GROUP BY
        e.id, e.name, e.department, e.salary
)
SELECT
    employee_id,
    name,
    department,
    month,
    ROUND(salary, 2) AS projected_salary
FROM
    CompletedCases
    MODEL
    PARTITION BY (employee_id, name, department)
    DIMENSION BY (0 AS month)
    MEASURES (salary, case_count, dept_avg_cases)
    RULES ITERATE (11) (
    salary[iteration_number + 1] =
    CASE
    WHEN case_count[0] > dept_avg_cases[0]
    THEN salary[0] * (1 + LEAST((case_count[0] / NULLIF(dept_avg_cases[0], 0) - 1) * 0.01, 0.20))
    ELSE salary[0]
    END
    )
ORDER BY
    employee_id, month;