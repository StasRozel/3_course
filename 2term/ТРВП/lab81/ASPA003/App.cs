using DAL003;
using Microsoft.Extensions.FileProviders;

namespace ASPA003;

public static class App
{
    public static void Main(string[] args) 
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();
        
        using (IRepository repository = CelebrityRepositoryFactory.Create("Сelebrities"))
        {
            app.MapGet("/Celebrities", () => repository.GetAllCelebrities());
            app.MapGet("/Celebrities/{id:int}", (int id) => repository.GetCelebrityById(id));
            app.MapGet("/Celebrities/BySurname/{surname}", (string surname) => repository.GetCelebritiesBySurname(surname));
            app.MapGet("/Celebrities/PhotoPathById/{id:int}", (int id) => repository.GetPhotoPathById(id));
        }

        app.UseStaticFiles(new StaticFileOptions()
        {
            FileProvider = new PhysicalFileProvider("/home/alexei/Documents/bstu/ASP_NET_CORE/ASPA/DAL003/Сelebrities"),
            RequestPath = "/Photo",
        });
        
        app.UseStaticFiles(new StaticFileOptions()
        {
            FileProvider = new PhysicalFileProvider("/home/alexei/Documents/bstu/ASP_NET_CORE/ASPA/DAL003/Сelebrities"),
            RequestPath = "/Сelebrities/download",
            OnPrepareResponse = ctx =>
            {
                var fileName = Path.GetFileName(ctx.Context.Request.Path.Value);

                ctx.Context.Response.Headers.Append("Content-Disposition", $"attachment; filename=/Photo/\"{fileName}\"");
                ctx.Context.Response.Headers.Append("Content-Type", "image/jpeg");
            }
        });
        
        app.UseDirectoryBrowser(new DirectoryBrowserOptions
        {
            FileProvider = new PhysicalFileProvider("/home/alexei/Documents/bstu/ASP_NET_CORE/ASPA/DAL003/Сelebrities"),
            RequestPath = "/Сelebrities/download",
        });


        app.Run();
    }
}