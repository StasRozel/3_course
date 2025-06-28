using ANC25_WEBAPI_DLL;
using DAL_Celebrity_MSSQL;
using DAL_Celebrity;
using DAL_Celebrity.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

namespace ASPA008_1;

public class App
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddControllersWithViews();
        builder.Services.AddRazorPages();
        builder.Configuration.AddJsonFile("Celebrities.config.json", false, true);

        var config = builder.Configuration.GetSection("celebrities");

        var connectionString = config["connection_string"];
        var photosFolder = config["photos_folder"];
        var photosRequestPath = config["photos_request_path"];
        var countryCodesJsonPath = config["iso3166_country_codes"];

        builder.Services.AddDbContext<CelebrityDbContext>(options =>
            options.UseSqlServer(connectionString));
        builder.Services.AddScoped<IRepository<Celebrity, LifeEvent>, CelebrityRepository>();
        builder.Services.AddSingleton<CountryCodesProvider>(provider =>
            new CountryCodesProvider(countryCodesJsonPath));


        var app = builder.Build();

        app.UseDeveloperExceptionPage();
        app.UseStaticFiles();

        if (Directory.Exists(photosFolder))
        {
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(photosFolder),
                RequestPath = photosRequestPath
            });
        }
        else
        {
            if (photosFolder != null) Directory.CreateDirectory(photosFolder);
        }

        app.UseRouting();
        app.MapRazorPages();

        app.MapControllerRoute(
            "celebrity",
            "{controller}/{action}/{id?}",
            new { controller = "Celebrities", action = "Index" }
        );

        app.Run();
    }
}