CREATE TABLE Report
(
    id           NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    report_data  XMLTYPE NOT NULL,
    created_date DATE DEFAULT SYSDATE
);


CREATE OR REPLACE PROCEDURE GENERATE_XML_REPORT(p_GeneratedXML OUT XMLTYPE)
    IS
BEGIN
    SELECT XMLElement("Report",
                      XMLForest(TO_CHAR(SYSDATE, 'YYYY-MM-DD"T"HH24:MI:SS') AS "Timestamp"),
                      XMLElement("Data",
                                 (SELECT XMLAgg(
                                                 XMLElement("Tasks",
                                                            XMLForest(
                                                                    t.estimated_hours AS "estimated_hours",
                                                                    t.task_description AS "task_description",
                                                                    t.status AS "status"
                                                            )
                                                 ))
                                  FROM Tasks t
                                           INNER JOIN Employees e ON t.assigned_employee_id = e.id
                                           INNER JOIN RepairRequests rr ON t.repair_request_id = rr.id),
                                 (SELECT XMLAgg(
                                                 XMLElement("ServiceCenters",
                                                            XMLForest(
                                                                    id AS "id",
                                                                    name AS "name",
                                                                    address AS "address",
                                                                    contact_info AS "contact_info",
                                                                    specialization AS "specialization"
                                                            )
                                                 ))
                                  FROM ServiceCenters),
                                 (SELECT XMLAgg(
                                                 XMLElement("Parts",
                                                            XMLForest(
                                                                    id AS "id",
                                                                    equipment_id AS "equipment_id",
                                                                    name AS "name",
                                                                    part_number AS "part_number",
                                                                    quantity AS "quantity",
                                                                    price AS "price",
                                                                    supplier AS "supplier",
                                                                    TO_CHAR(last_restock_date, 'YYYY-MM-DD') AS
                                                                    "last_restock_date"
                                                            )
                                                 ))
                                  FROM Parts)
                      )
           )
    INTO p_GeneratedXML
    FROM dual;
END;
/

CREATE OR REPLACE PROCEDURE INSERT_XML_INTO_REPORT
    IS
    v_ReportXML XMLTYPE;
BEGIN
    GENERATE_XML_REPORT(v_ReportXML);
    DBMS_OUTPUT.PUT_LINE(v_ReportXML.getClobVal());
    INSERT INTO Report (report_data, created_date)
    VALUES (v_ReportXML, SYSDATE);
END;
/

BEGIN
    INSERT_XML_INTO_REPORT();
END;
/

CREATE INDEX IDX_XML_PRIMARY ON Report (report_data)
    INDEXTYPE IS XDB.XMLIndex;

SELECT R.id,
       x.price_value
FROM REPORT R,
     XMLTable(
             '/Report/Data/Parts'
             PASSING R.report_data
             COLUMNS
                 price_value DECIMAL(10, 2) PATH 'price/text()'
     ) x;

-- 6. Процедура для извлечения значения атрибута/элемента из XML
CREATE OR REPLACE PROCEDURE GET_XML_ATTRIBUTE_VALUE(
    p_node_name IN VARCHAR2
)
    IS
BEGIN
    IF p_node_name = '/Report/Data/Tasks/task_description/text()' THEN
        FOR rec IN (
            SELECT R.id, x.value
            FROM REPORT R,
                 XMLTable(
                         '/Report/Data/Tasks'
                         PASSING R.report_data
                         COLUMNS
                             value VARCHAR2(4000) PATH 'task_description/text()'
                 ) x
            )
            LOOP
                DBMS_OUTPUT.PUT_LINE('ID: ' || rec.id || ', Value: ' || rec.value);
            END LOOP;
    ELSIF p_node_name = '/Report/Data/Parts/price/text()' THEN
        FOR rec IN (
            SELECT R.id, x.value
            FROM REPORT R,
                 XMLTable(
                         '/Report/Data/Parts'
                         PASSING R.report_data
                         COLUMNS
                             value DECIMAL(10, 2) PATH 'price/text()'
                 ) x
            )
            LOOP
                DBMS_OUTPUT.PUT_LINE('ID: ' || rec.id || ', Value: ' || rec.value);
            END LOOP;
    ELSE
        DBMS_OUTPUT.PUT_LINE('Unsupported node path: ' || p_node_name);
    END IF;
END;
/


BEGIN
    GET_XML_ATTRIBUTE_VALUE('/Report/Data/Tasks/task_description/text()');
END;
/
