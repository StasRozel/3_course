using DAL004;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ASPA004_3;

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
                if (repository.SaveChanges() == 0 || rc == null)
                    throw new SaveException("/Celebrities error, SaveChanges == 0");

                return new Celebrity(celebrity.Id, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath);
            });

            app.MapFallback((HttpContext ctx) =>
                Results.NotFound(new { error = $"Path {ctx.Request.Path} not supported" }));

            app.MapDelete("/Celebrities/{id:int}", (int id) =>
            {
                if (!repository.DeleteCelebrityById(id))
                    throw new DeleteByIdException($"DELETE /Celebrities error, Id = {id} ");

                return JsonConvert.SerializeObject(new { message = $"DELETE /Celebrities, Id = {id}" });
            });

            app.MapPut("/Celebrities/{id:int}", (int id, Celebrity celebrity) =>
            {
                if (repository.GetCelebrityById(id) == null)
                    throw new FoundByIdException($"DELETE Celebrity with {id} not found");
                if (repository.UpdateCelebrityById(id, celebrity) == null)
                    throw new UpdateByIdException($"UPDATE Celebrity with {id} can't be updated");

                return repository.GetCelebrityById(id);
            });


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
                        string title;
                        var detail = ex.Message;

                        switch (ex)
                        {
                            case FoundByIdException:
                                statusCode = StatusCodes.Status404NotFound;
                                title = "Not Found";
                                break;
                            case BadHttpRequestException:
                                statusCode = StatusCodes.Status400BadRequest;
                                title = "Bad Request";
                                break;
                            case SaveException:
                                statusCode = StatusCodes.Status500InternalServerError;
                                title = "Save Error";
                                break;
                            case AddCelebrityException:
                                statusCode = StatusCodes.Status500InternalServerError;
                                title = "Add Celebrity Error";
                                break;
                            case DeleteByIdException:
                                statusCode = StatusCodes.Status400BadRequest;
                                title = "Delete Error";
                                break;
                            case UpdateByIdException:
                                statusCode = StatusCodes.Status400BadRequest;
                                title = "Update Error";
                                break;
                            default:
                                statusCode = StatusCodes.Status500InternalServerError;
                                title = "Unknown Error";
                                break;
                        }

                        context.Response.StatusCode = statusCode;
                        await context.Response.WriteAsJsonAsync(new ProblemDetails
                        {
                            Status = statusCode,
                            Title = title,
                            Detail = detail,
                            Instance = context.Request.Path
                        });
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

public class DeleteByIdException(string message) : Exception($"Delete by Id:{message}");

public class UpdateByIdException(string message) : Exception($"Update by Id:{message}");