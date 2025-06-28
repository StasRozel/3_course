CREATE TABLE Report
(
    id           INT IDENTITY (1,1) PRIMARY KEY,
    report_data  XML NOT NULL,
    created_date DATETIME2 DEFAULT GETDATE()
);

CREATE OR ALTER PROCEDURE GENERATE_XML_REPORT @GeneratedXML XML OUT
AS
BEGIN
    SET @GeneratedXML = (SELECT GETDATE() AS Timestamp,
                                (SELECT t.estimated_hours,
                                        t.task_description,
                                        t.status
                                 FROM Tasks t
                                          INNER JOIN EMPLOYEES e ON t.assigned_employee_id = e.ID
                                          INNER JOIN RepairRequests rr ON t.repair_request_id = rr.ID
                                 FOR XML PATH('Tasks'), TYPE),
                                (SELECT id,
                                        name,
                                        address,
                                        contact_info,
                                        specialization
                                 FROM ServiceCenters
                                 FOR XML PATH('ServiceCenters'), TYPE),
                                (SELECT id,
                                        equipment_id,
                                        name,
                                        part_number,
                                        quantity,
                                        price,
                                        supplier,
                                        last_restock_date
                                 FROM Parts
                                 FOR XML PATH('Parts'), TYPE)
                         FOR XML PATH('Data'), ROOT('Report'), TYPE);
END;

GO
CREATE OR ALTER PROCEDURE INSERT_XML_INTO_REPORT
AS
BEGIN
    DECLARE @ReportXML XML;
    EXEC GENERATE_XML_REPORT @GeneratedXML = @ReportXML OUT;
    SELECT @ReportXML AS GeneratedXML;

    SELECT @ReportXML;
    INSERT INTO Report (report_data)
    VALUES (@ReportXML);
END;

GO
EXEC INSERT_XML_INTO_REPORT;


CREATE PRIMARY XML INDEX IDX_XML_PRIMARY ON REPORT (report_data);
CREATE XML INDEX IDX_XML_SECONDARY ON REPORT (report_data)
    USING XML INDEX IDX_XML_PRIMARY FOR PATH;
GO

SELECT R.id,
       M.C.value('(Parts/price/text())[1]', 'decimal(10,2)') AS price_value
FROM REPORT R
         OUTER APPLY R.report_data.nodes('/Report/Data/Parts') AS M(C);

CREATE OR ALTER PROCEDURE GET_XML_ATTRIBUTE_VALUE @NODE_NAME NVARCHAR(MAX)
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);
    SET @sql = '
        SELECT
            R.id,
            M.C.value(''(' + @NODE_NAME + ')[1]'', ''nvarchar(max)'') AS VALUE
        FROM
            REPORT R
        OUTER APPLY
            R.report_data.nodes(''/Report/Data/Tasks'') AS M(C)';

    EXEC sp_executesql @sql;
END;
GO

EXEC GET_XML_ATTRIBUTE_VALUE '/Report/Data/Tasks';

