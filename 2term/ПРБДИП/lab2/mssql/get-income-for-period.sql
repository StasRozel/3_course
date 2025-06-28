CREATE FUNCTION GetIncomeForPeriod
(
    @start_date DATE,
    @end_date DATE
)
RETURNS DECIMAL(10, 2)
AS
BEGIN
    DECLARE @total_income DECIMAL(10, 2);

    SELECT @total_income = ISNULL(SUM(cost), 0)
    FROM Maintenance
    WHERE date_performed BETWEEN @start_date AND @end_date;

    RETURN @total_income;
END;