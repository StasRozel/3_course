CREATE FUNCTION GetPartsExpensesForPeriod
(
    @start_date DATE,
    @end_date DATE
)
RETURNS DECIMAL(10, 2)
AS
BEGIN
    DECLARE @total_expenses DECIMAL(10, 2);

    SELECT @total_expenses = ISNULL(SUM(price * quantity), 0)
    FROM Parts
    WHERE last_restock_date BETWEEN @start_date AND @end_date;

    RETURN @total_expenses;
END;