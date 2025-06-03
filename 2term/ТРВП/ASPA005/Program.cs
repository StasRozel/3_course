using Microsoft.AspNetCore.Diagnostics;
using DAL004;

namespace ASPA005_1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            Repository.JSONFileName = "Сelebrities.json"; // имя файла
            string path = "D:\\Универ\\3course\\2term\\ТРВП\\DAL004\\DAL004\\Сelebrities\\" + Repository.JSONFileName;
            using (IRepository repository = Repository.Create("\\Сelebrities\\"))
            {
                app.UseExceptionHandler("/Celebrities/Error");

                app.MapGet("/Celebrities", () => repository.getAllCelebrities());

                app.MapGet("/Celebrities/{id:int}", (int id) =>
                {
                    Celebrity? celebrity = repository.getCelebrityById(id);
                    if (celebrity == null)
                        throw new FoundByIdException($"Celebrity Id = {id}");
                    return celebrity;
                });

                app.MapPost("/Celebrities", (Celebrity celebrity) =>
                {
                    if (!File.Exists(path))
                        throw new FoundFileException($"Not found path {path}");
                    int? id = repository.addCelebrity(celebrity);
                    if (id == null)
                        throw new AddCelebrityException("/Celebrities error, id == null");
                    if (repository.SaveChanges() <= 0)
                        throw new SaveException("/Celebrities error, SaveChanges() <= 0");
                    return new Celebrity((int)id, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath);
                }).AddEndpointFilter(async (context, next) =>
                {
                    var celebrity = context.GetArgument<Celebrity>(0);
                    var oldCelebrity = repository.getCelebritiesBySurname(celebrity.Surname);

                    if (celebrity == null)
                        throw new ValueNullCelebrityException("The celebrity object cannot be null.");

                    if (oldCelebrity.Length != 0)
                        throw new FieldNullCelebrityException("This Surname is already in use");

                    return await next(context);
                }).AddEndpointFilter(async (context, next) =>
                {
                    var celebrity = context.GetArgument<Celebrity>(0);
                    if (celebrity == null)
                        return Results.Problem("The celebrity object cannot be null.", statusCode: 500);

                    var basePath = "BasePath"; // Укажите правильный путь
                    var photoPath = Path.Combine(basePath, celebrity.PhotoPath);
                    if (!File.Exists(photoPath))
                    {
                        var fileName = Path.GetFileName(celebrity.PhotoPath);

                        // Вариант с HttpContext
                        context.HttpContext.Response.Headers.Add("X-Celebrity", $" not found {fileName}");
                        return Results.Problem($"File not found: {fileName}", statusCode: 404);
                    }
                    return await next(context);
                });
                app.MapDelete("/Celebrities/{id:int}", (int id) =>
                {
                    Celebrity? celebrity = repository.getCelebrityById(id);

                    if (celebrity == null)
                        throw new FoundByIdException($"Celebrity Id = {id}");

                    return repository.delCelebrityById(id);
                });

                app.MapPut("/Celebrities/{id:int}", (int id, Celebrity celebrity) =>
                {
                    Celebrity? _celebrity = repository.getCelebrityById(id);

                    if (_celebrity == null)
                        throw new FoundByIdException($"Celebrity Id = {id}");

                    return repository.updCelebrityById(id, celebrity);
                });
                app.MapFallback((HttpContext ctx) => Results.NotFound(new { error = $"path {ctx.Request.Path} not supported" }));
                
                app.Map("/Celebrities/Error", (HttpContext ctx) =>
                {
                    Exception? ex = ctx.Features.Get<IExceptionHandlerFeature>()?.Error;
                    IResult rc = Results.Problem(detail: "Panic", instance: app.Environment.EnvironmentName, title: "ASPA005", statusCode: 500);
                    if (ex != null)
                    {
                        if (ex is FoundByIdException)
                            rc = Results.NotFound(ex.Message); // 404 - не найден
                        if (ex is BadHttpRequestException)
                            rc = Results.BadRequest(ex.Message); // 400 - ошибка в формате запроса
                        if (ex is SaveException)
                            rc = Results.Problem(title: "ASPA004/SaveChanges", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
                        if (ex is AddCelebrityException)
                            rc = Results.Problem(title: "ASPA004/addCelebrity", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
                        if (ex is FoundFileException)
                            rc = Results.Problem(title: "ASPA004/addCelebrity", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
                        if (ex is DeleteCelebrityException)
                            rc = Results.NotFound(ex.Message);
                        if (ex is ValueNullCelebrityException)
                            rc = Results.Problem(title: "ASPA005/addCelebrity", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
                        if (ex is FieldNullCelebrityException)
                            rc = Results.Problem(detail: ex.Message, statusCode: 409);
                    }
                    return rc;
                });

                app.Run();
            }
        }
}
   
}
