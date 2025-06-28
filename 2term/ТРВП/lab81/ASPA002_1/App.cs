
namespace ASPA002_1;

public static class App
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();
        app.UseWelcomePage("/aspnetcore");
        app.UseDefaultFiles();
        app.UseStaticFiles();
        
        // Useless route handler
        // app.MapGet("/aspnetcore", () => "Hello from /aspnetcore!");

        app.Run();
    }
}