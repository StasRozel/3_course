using Microsoft.Extensions.FileProviders;

namespace ASPA002_2
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            var options = new DefaultFilesOptions();
            options.DefaultFileNames.Clear();
            options.DefaultFileNames.Add("Neumann.html");

            app.UseDefaultFiles(options);

            app.UseStaticFiles();

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                Path.Combine(Directory.GetCurrentDirectory(), "Picture")),
                RequestPath = "/static"
            });
            
            app.MapGet("/hw", () => "Hello World!");

            app.Run();
        }
    }
}
