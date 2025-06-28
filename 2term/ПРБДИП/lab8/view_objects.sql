CREATE OR REPLACE VIEW Clients_OBJ_VIEW AS
SELECT Client_Type(
               c.id,
               c.name,
               c.contact_info
       ) AS client_obj
FROM Clients c;

CREATE OR REPLACE VIEW Tasks_OBJ_VIEW AS
SELECT Task_Type(
               t.id,
               (SELECT REF(c) FROM Clients_OBJ c WHERE c.id = t.client_id),
               t.equipment_id,
               t.assigned_employee_id,
               t.request_date,
               t.problem_description,
               t.status,
               t.completion_date
       ) AS task_obj
FROM Tasks t;

SELECT t.task_obj.id                  AS task_id,
       t.task_obj.problem_description AS description,
       t.task_obj.status              AS status,
       t.task_obj.get_task_age()      AS age_in_days,
       t.task_obj.get_priority()      AS priority
FROM Tasks_OBJ_VIEW t
ORDER BY t.task_obj.get_priority() DESC;

SELECT t.task_obj.id                     AS task_id,
       DEREF(t.task_obj.client_ref).name AS client_name,
       t.task_obj.problem_description    AS description,
       t.task_obj.status                 AS status,
       t.task_obj.get_task_age()         AS age_in_days
FROM Tasks_OBJ_VIEW t
ORDER BY t.task_obj.get_task_age() DESC;