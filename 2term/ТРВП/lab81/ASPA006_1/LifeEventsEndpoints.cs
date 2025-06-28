using DAL_Celebrity;
using DAL_Celebrity.Entity;

namespace ASPA006_1;

public static class LifeEventsEndpoints
{
    public static void RegisterLifeEventsEndpoints(this WebApplication app)
    {
        var lifeevents = app.MapGroup("/api/Lifeevents");

        lifeevents.MapGet("/", (IRepository<Celebrity, LifeEvent> repo) =>
            Results.Ok(repo.GetAllLifeEvents()));

        lifeevents.MapGet("/{id:int:min(1)}", (IRepository<Celebrity, LifeEvent> repo, int id) =>
        {
            var lifeEvent = repo.GetLifeEventById(id);
            return lifeEvent != null ? Results.Ok(lifeEvent) : Results.NotFound();
        });

        lifeevents.MapGet("/Celebrities/{id:int:min(1)}", (IRepository<Celebrity, LifeEvent> repo, int id) =>
        {
            var lifeEvents = repo.GetLifeEventsByCelebrityId(id);
            return lifeEvents.Count != 0 ? Results.Ok(lifeEvents) : Results.NotFound();
        });

        lifeevents.MapDelete("/{id:int:min(1)}", (IRepository<Celebrity, LifeEvent> repo, int id) =>
        {
            var success = repo.DeleteLifeEvent(id);
            return success ? Results.NoContent() : Results.NotFound();
        });

        lifeevents.MapPost("/", (IRepository<Celebrity, LifeEvent> repo, LifeEvent lifeEvent) =>
        {
            var success = repo.AddLifeEvent(lifeEvent);
            return success ? Results.Created($"/api/Lifeevents/{lifeEvent.Id}", lifeEvent) : Results.BadRequest();
        });

        lifeevents.MapPut("/{id:int:min(1)}", (IRepository<Celebrity, LifeEvent> repo, int id, LifeEvent lifeEvent) =>
        {
            var success = repo.UpdateLifeEvent(id, lifeEvent);
            return success ? Results.NoContent() : Results.NotFound();
        });
    }
}