namespace ASPA002_1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.UseStaticFiles("/files");

            app.MapGet("/", () => "Hello World!");
            app.UseWelcomePage("/aspnetcore");

            app.Run();
        }
    }
}
