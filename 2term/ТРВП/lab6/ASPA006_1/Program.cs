using ASPA006_1;
using DAL_Celebrity_MSSQL;
using DAL_Celebrity;
using DAL_Celebrity.Entity;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("Celebrities.config.json", false);

builder.Services.Configure<CelebritiesConfig>(
    builder.Configuration.GetSection("Celebrities"));

builder.Services.AddScoped<IRepository<Celebrity, LifeEvent>>(sp =>
{
    var config = sp.GetRequiredService<IOptions<CelebritiesConfig>>();
    return CelebrityRepositoryFactory.CreateWithDirectConnectionString(config.Value.ConnectionString);
});
    
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseMiddleware<ErrorHandlingMiddleware>();

app.RegisterCelebritiesEndpoints();
app.RegisterLifeEventsEndpoints();

app.Run();