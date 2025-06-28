
using Microsoft.Extensions.FileProviders;

namespace ASPA002_2;

public static class App
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();
        
        DefaultFilesOptions options = new();
        options.DefaultFileNames.Clear();
        options.DefaultFileNames.Add("Neumann.html");
        
        app.UseDefaultFiles(options);
        app.UseStaticFiles();
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Picture")),
            RequestPath = "/static" 
        });
        app.Run();
    }
}