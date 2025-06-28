using DAL004;
using Microsoft.AspNetCore.Diagnostics;

namespace ASPA004_2;

public class App
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();

        app.MapGet("/", () => "Celebrities API");

        using (var repository = CelebrityRepositoryFactory.Create("Сelebrities"))
        {
            app.MapGet("/Celebrities", () => repository.GetAllCelebrities());

            app.MapGet("/Celebrities/{id:int}", (int id) =>
            {
                var celebrity = repository.GetCelebrityById(id);
                if (celebrity is null) throw new FoundByIdException($"Celebrity Id = {id}");
                return new Celebrity(celebrity.Id, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath);
            });

            app.MapPost("/Celebrities", (Celebrity celebrity) =>
            {
                if (!IsCelebrityValid(celebrity)) throw new AddCelebrityException("/Celebrities error, id == null");

                var rc = repository.AddCelebrity(celebrity);
                if (repository.SaveChanges() == 0 && rc == null)
                    throw new SaveException("/Celebrities error, SaveChanges == 0");
                var returnId = rc;

                return new Celebrity(rc ?? 0, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath);
            });

            app.MapFallback((HttpContext ctx) =>
                Results.NotFound(new { error = $"Path {ctx.Request.Path} not supported" }));

            app.MapGet("/aboba",
                () => { throw new NotImplementedException("We are working on aboba endpoint"); });

            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    context.Response.ContentType = "application/json";
                    var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerFeature>();

                    if (exceptionHandlerPathFeature?.Error is not null)
                    {
                        var ex = exceptionHandlerPathFeature.Error;

                        int statusCode;
                        object response;

                        switch (ex)
                        {
                            case FoundByIdException:
                                statusCode = StatusCodes.Status404NotFound;
                                response = new { error = ex.Message };
                                break;
                            case BadHttpRequestException:
                                statusCode = StatusCodes.Status400BadRequest;
                                response = new { error = ex.Message };
                                break;
                            case SaveException:
                                statusCode = StatusCodes.Status500InternalServerError;
                                response = new
                                {
                                    title = "ASPA004/SaveChanges",
                                    detail = ex.Message,
                                    instance = context.Request.Path
                                };
                                break;
                            case AddCelebrityException:
                                statusCode = StatusCodes.Status500InternalServerError;
                                response = new
                                {
                                    title = "ASPA004/addCelebrity",
                                    detail = ex.Message,
                                    instance = context.Request.Path
                                };
                                break;
                            default:
                                statusCode = StatusCodes.Status500InternalServerError;
                                response = new
                                {
                                    type = ex.GetType().Name,
                                    title = "Unknown Error",
                                    detail = ex.Message,
                                    instance = context.Request.Path
                                };
                                break;
                        }

                        context.Response.StatusCode = statusCode;
                        await context.Response.WriteAsJsonAsync(response);
                    }
                });
            });
        }

        app.Run();
    }

    public static bool IsCelebrityValid(Celebrity celebrity)
    {
        return celebrity is { Firstname: not null, Surname: not null, PhotoPath: not null };
    }
}

public class FoundByIdException(string message) : Exception($"Found by Id: {message}");

public class SaveException(string message) : Exception($"SaveChanges error: {message}");

public class AddCelebrityException(string message) : Exception($"AddCelebrityException error: {message}");