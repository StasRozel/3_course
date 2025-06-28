CREATE OR REPLACE FUNCTION GetPartsExpensesForPeriod
(
    p_start_date IN DATE,
    p_end_date IN DATE
)
RETURN NUMBER
AS
    v_total_expenses NUMBER(10, 2);
BEGIN
    SELECT NVL(SUM(price * quantity), 0) INTO v_total_expenses
    FROM Parts
    WHERE last_restock_date BETWEEN p_start_date AND p_end_date;

    RETURN v_total_expenses;
END GetPartsExpensesForPeriod;
/