
namespace Test_ASPA005_3
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            Test test = new Test();
            Console.WriteLine("-- /A -----------------------------------------------------------------");
            await test.ExecuteGET<int>("http://localhost:5000/A/3", (int x, int y, int status) => (x == 3 && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteGET<int>("http://localhost:5000/A/-3", (int x, int y, int status) => (x == -3 && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteGET<int>("http://localhost:5000/A/131", (int x, int y, int status) => (x == 131 && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecutePOST<int>("http://localhost:5000/A/3", (int x, int y, int status) => (x == 3 && y == 3 && status == 200) ? Test.OK : Test.NOK);
            await test.ExecutePOST<int>("http://localhost:5000/A/-3", (int x, int y, int status) => (x == null && y == null && status == 404) ? Test.OK : Test.NOK);
            await test.ExecutePOST<int>("http://localhost:5000/A/131", (int x, int y, int status) => (x == null && y == null && status == 400) ? Test.OK : Test.NOK);
            await test.ExecutePUT<int>("http://localhost:5000/A/2/3", (int x, int y, int status) => (x == 2 && y == 3 && status == 200) ? Test.OK : Test.NOK);
            await test.ExecutePUT<int>("http://localhost:5000/A/2/-3", (int x, int y, int status) => (x == null && y == null && status == 400) ? Test.OK : Test.NOK);
            await test.ExecutePUT<int>("http://localhost:5000/A/2/131", (int x, int y, int status) => (x == null && y == null && status == 400) ? Test.OK : Test.NOK);
            await test.ExecuteDELETE<int>("http://localhost:5000/A/3/-3", (int x, int y, int status) => (x == null && y == null && status == 404) ? Test.OK : Test.NOK);
            await test.ExecuteDELETE<int>("http://localhost:5000/A/3/99", (int x, int y, int status) => (x == 3 && y == 99 && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteDELETE<int>("http://localhost:5000/A/3/-1", (int x, int y, int status) => (x == 99 && y == 1 && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteDELETE<int>("http://localhost:5000/A/1/-99", (int x, int y, int status) => (x == null && y == null && status == 404) ? Test.OK : Test.NOK);
            await test.ExecuteDELETE<int>("http://localhost:5000/A/25-101", (int x, int y, int status) => (x == null && y == null && status == 400) ? Test.OK : Test.NOK);

            Console.WriteLine("-- /B -----------------------------------------------------------------");
            await test.ExecuteGET<float>("http://localhost:5000/B/2.5", (float x, float y, int status) => (x == 2.5 && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteGET<float>("http://localhost:5000/B/2", (float x, float y, int status) => (x == 2 && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteGET<float>("http://localhost:5000/B/2X", (float x, float y, int status) => (x == null && y == null && status == 400) ? Test.OK : Test.NOK);
            await test.ExecutePOST<float>("http://localhost:5000/B/2.5", (float x, float y, int status) => (x == 2.5 && y == 3.2 && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteDELETE<float>("http://localhost:5000/B/2.5-3.2", (float x, float y, int status) => (x == 2.5 && y == 3.2 && status == 200) ? Test.OK : Test.NOK);

            Console.WriteLine("-- /C -----------------------------------------------------------------");
            await test.ExecuteGET<bool>("http://localhost:5000/C/2.5", (bool x, bool y, int status) => (x == null && y == null && status == 400) ? Test.OK : Test.NOK);
            await test.ExecuteGET<bool>("http://localhost:5000/C/true", (bool x, bool y, int status) => (x == true && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecutePOST<bool>("http://localhost:5000/C/true_false", (bool x, bool y, int status) => (x == true && y == false && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteDELETE<bool>("http://localhost:5000/C/true_false", (bool x, bool y, int status) => (x == null && y == null && status == 400) ? Test.OK : Test.NOK);

            Console.WriteLine("-- /D -----------------------------------------------------------------");
            await test.ExecuteGET<DateTime>("http://localhost:5000/D/2025-02-25", (DateTime x, DateTime y, int status) => (x == new DateTime(2025, 02, 25) && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteGET<DateTime>("http://localhost:5000/D/2025-02-25", (DateTime x, DateTime y, int status) => (x == new DateTime(2025, 02, 25) && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteGET<DateTime>("http://localhost:5000/D/2025x02x25", (DateTime x, DateTime y, int status) => (x == null && y == null && status == 400) ? Test.OK : Test.NOK);
            await test.ExecutePOST<DateTime>("http://localhost:5000/D/2025-02-25", (DateTime x, DateTime y, int status) => (x == new DateTime(2025, 02, 25) && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecutePOST<DateTime>("http://localhost:5000/D/2025-02-25|2025-03-15", (DateTime x, DateTime y, int status) => (x == new DateTime(2025, 02, 25) && y == new DateTime(2025, 03, 15) && status == 200) ? Test.OK : Test.OK);
            await test.ExecutePUT<DateTime>("http://localhost:5000/D/2025-02-25|2025-03-15", (DateTime x, DateTime y, int status) => (x == null && y == null && status == 400) ? Test.OK : Test.NOK);

            Console.WriteLine("--- /E ---------------------------------------------------");
            await test.ExecuteGET<string?>("http://localhost:5000/E/12-bis", (string? x, string? y, int status) => (x == "bis" && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteGET<string?>("http://localhost:5000/E/11-bis", (string? x, string? y, int status) => (x == null && y == null && status == 404) ? Test.OK : Test.NOK);
            await test.ExecuteGET<string?>("http://localhost:5000/E/12-ptr", (string? x, string? y, int status) => (x == "7777" && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteGET<string?>("http://localhost:5000/E/12", (string? x, string? y, int status) => (x == null && y == null && status == 404) ? Test.OK : Test.NOK);
            await test.ExecutePUT<string?>("http://localhost:5000/E/abcd", (string? x, string? y, int status) => (x == "abcd" && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecutePUT<string?>("http://localhost:5000/E/abcd12", (string? x, string? y, int status) => (x == null && y == null && status == 404) ? Test.OK : Test.NOK);
            await test.ExecutePUT<string?>("http://localhost:5000/E/12/356", (string? x, string? y, int status) => (x == null && y == null && status == 404) ? Test.OK : Test.NOK);
            await test.ExecutePUT<string?>("http://localhost:5000/E/aabbccddeeffgghh", (string? x, string? y, int status) => (x == null && y == null && status == 404) ? Test.OK : Test.NOK);

            Console.WriteLine("--- /F ---------------------------------------------------");
            await test.ExecuteGET<string?>("http://localhost:5000/F/symbols%5b%5bw", (string? x, string? y, int status) => (x == "symbols[[w" && y == null && status == 200) ? Test.OK : Test.NOK);
            await test.ExecuteGET<string?>("http://localhost:5000/F/xxxx/yyyy_bv", (string? x, string? y, int status) => (x == null && y == null && status == 404) ? Test.OK : Test.NOK);
            await test.ExecuteGET<string?>("http://localhost:5000/F/xxxx/yyyy_mv", (string? x, string? y, int status) => (x == null && y == null && status == 404) ? Test.OK : Test.NOK);
            await test.ExecuteGET<string?>("http://localhost:5000/F/xxxx/yyyy_cv", (string? x, string? y, int status) => (x == null && y == null && status == 404) ? Test.OK : Test.NOK);
            await test.ExecuteGET<string?>("http://localhost:5000/F/xxxx/yyyy_av", (string? x, string? y, int status) => (x == null && y == null && status == 404) ? Test.OK : Test.NOK);
        }
    }
}
