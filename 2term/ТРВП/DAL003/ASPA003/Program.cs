using DAL003;
using Microsoft.Extensions.FileProviders;

namespace ASPA003;

public static class App
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();

        using (IRepository repository = Repository.Create("Ñelebrities"))
        {
            app.MapGet("/Celebrities", () => repository.getAllCelebrities());
            app.MapGet("/Celebrities/{id:int}", (int id) => repository.getCelebrityById(id));
            app.MapGet("/Celebrities/BySurname/{surname}", (string surname) => repository.getCelebritiesBySurname(surname));
            app.MapGet("/Celebrities/PhotoPathById/{id:int}", (int id) => repository.getPhotoPathById(id));
        }

        app.UseStaticFiles(new StaticFileOptions()
        {
            FileProvider = new PhysicalFileProvider("D:\\Óíèâåð\\3course\\2term\\ÒÐÂÏ\\DAL003\\DAL003\\Ñelebrities"),
            RequestPath = "/Photo",
        });

        app.UseStaticFiles(new StaticFileOptions()
        {
            FileProvider = new PhysicalFileProvider("D:\\Óíèâåð\\3course\\2term\\ÒÐÂÏ\\DAL003\\DAL003\\Ñelebrities"),
            RequestPath = "/Ñelebrities/download",
            OnPrepareResponse = ctx =>
            {
                var fileName = Path.GetFileName(ctx.Context.Request.Path.Value);

                ctx.Context.Response.Headers.Append("Content-Disposition", $"attachment; filename=/Photo/\"{fileName}\"");
                ctx.Context.Response.Headers.Append("Content-Type", "image/jpeg");
            }
        });

        app.UseDirectoryBrowser(new DirectoryBrowserOptions
        {
            FileProvider = new PhysicalFileProvider("D:\\Óíèâåð\\3course\\2term\\ÒÐÂÏ\\DAL003\\DAL003\\Ñelebrities"),
            RequestPath = "/Ñelebrities/download",
        });


        app.Run();
    }
}