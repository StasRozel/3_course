using DAL_Celebrity;
using DAL_Celebrity.Entity;
using Microsoft.Extensions.Options;

namespace ASPA006_1;

public static class CelebritiesEndpoints
{
    public static void RegisterCelebritiesEndpoints(this WebApplication app)
    {
        var celebrities = app.MapGroup("/api/Celebrities");

        celebrities.MapGet("/", (IRepository<Celebrity, LifeEvent> repo) =>
            Results.Ok(repo.GetAllCelebrities()));

        celebrities.MapGet("/{id:int:min(1)}", (IRepository<Celebrity, LifeEvent> repo, int id) =>
        {
            var celebrity = repo.GetCelebrityById(id);
            return celebrity != null ? Results.Ok(celebrity) : Results.NotFound();
        });

        celebrities.MapGet("/Lifeevents/{id:int:min(1)}", (IRepository<Celebrity, LifeEvent> repo, int id) =>
        {
            var events = repo.GetCelebrityByLifeEventId(id);
            return events != null ? Results.Ok(events) : Results.NotFound();
        });

        celebrities.MapDelete("/{id:int:min(1)}", (IRepository<Celebrity, LifeEvent> repo, int id) =>
        {
            var success = repo.DeleteCelebrity(id);
            return success ? Results.NoContent() : Results.NotFound();
        });

        celebrities.MapPost("/", (IRepository<Celebrity, LifeEvent> repo, Celebrity celebrity) =>
        {
            var success = repo.AddCelebrity(celebrity);
            return success ? Results.Created($"/api/Celebrities/{celebrity.Id}", celebrity) : Results.BadRequest();
        });

        celebrities.MapPut("/{id:int:min(1)}", (IRepository<Celebrity, LifeEvent> repo, int id, Celebrity celebrity) =>
        {
            var success = repo.UpdateCelebrity(id, celebrity);
            return success ? Results.NoContent() : Results.NotFound();
        });

        celebrities.MapGet("/photo/{fname}", (IOptions<CelebritiesConfig> config, string fname) =>
        {
            var path = Path.Combine(config.Value.PhotoPathFolder, fname);

            if (!File.Exists(path))
                return Results.NotFound($"Photo {fname} not found");

            return Results.File(path, "image/jpeg");
        });
    }
}