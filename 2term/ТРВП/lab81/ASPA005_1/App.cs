using DAL004;
using Microsoft.AspNetCore.Diagnostics;
using Newtonsoft.Json;

namespace ASPA005_1;

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
            }).AddEndpointFilter(async (context, next) =>
            {
                var celebrity = context.GetArgument<Celebrity>(0);

                if (celebrity == null) throw new AddCelebrityException("celebrity is null");
                if (celebrity.Surname.Length < 2) throw new InvalidCelebrityField("surname", "length < 2");
                if (celebrity.Surname == null) throw new InvalidCelebrityField("surname", "field required");

                return await next(context);
            }).AddEndpointFilter(async (context, next) =>
            {
                var celebrity = context.GetArgument<Celebrity>(0);

                if (celebrity == null) throw new AddCelebrityException("celebrity is null");
                if (repository.GetCelebritiesBySurname(celebrity.Surname) != null)
                    throw new InvalidCelebrityField("surname", "celebrity surname repeats");

                return await next(context);
            }).AddEndpointFilter(async (context, next) =>
            {
                var celebrity = context.GetArgument<Celebrity>(0);

                if (repository.GetPhotoPathById(celebrity.Id) == null)
                {
                    context.HttpContext.Response.Headers.Add("X-Celebrity", "Photo path not found");
                    throw new InvalidCelebrityField("photopath", "Photopath not found");
                }

                return await next(context);
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
                            case DeleteByIdException:
                                statusCode = StatusCodes.Status400BadRequest;
                                response = new
                                {
                                    title = "ASPA004/DeleteById",
                                    detail = ex.Message,
                                    instance = context.Request.Path,
                                    stack = JsonConvert.SerializeObject(ex.StackTrace)
                                };
                                break;
                            case UpdateByIdException:
                                statusCode = StatusCodes.Status400BadRequest;
                                response = new
                                {
                                    title = "ASPA004/UpdateById",
                                    detail = ex.Message,
                                    instance = context.Request.Path,
                                    stack = JsonConvert.SerializeObject(ex.StackTrace)
                                };
                                break;
                            case InvalidCelebrityField:
                                statusCode = StatusCodes.Status409Conflict;
                                response = new
                                {
                                    title = "ASPA005/Field validation",
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

public class DeleteByIdException(string message) : Exception($"Delete by Id:{message}");

public class UpdateByIdException(string message) : Exception($"Update by Id:{message}");

public class InvalidCelebrityException(string message) : Exception($"Invalid celebrity :{message}");

public class InvalidCelebrityField(string field, string message)
    : Exception($"Invalid celebrity field {field}, message: {message}");