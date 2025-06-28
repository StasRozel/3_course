CREATE OR REPLACE FUNCTION GetIncomeForPeriod
(
    p_start_date IN DATE,
    p_end_date IN DATE
)
RETURN NUMBER
AS
    v_total_income NUMBER(10, 2);
BEGIN
    SELECT NVL(SUM(cost), 0) INTO v_total_income
    FROM Maintenance
    WHERE date_performed BETWEEN p_start_date AND p_end_date;

    RETURN v_total_income;
END GetIncomeForPeriod;
/