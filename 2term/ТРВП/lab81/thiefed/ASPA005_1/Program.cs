using DAL004;
using Microsoft.AspNetCore.Diagnostics;

Repository.JSONFileName = "Celebrities.json";
using (IRepository repository = new Repository("Celebrities"))
{
    var builder = WebApplication.CreateBuilder(args);
    var app = builder.Build();

    app.UseExceptionHandler("/Celebrities/Error");

    app.MapGet("/Celebrities", () => repository.getAllCelebrities()); // ASPM03
    app.MapGet("/Celebrities/{id:int}", (int id) =>
    {
        Celebrity celebrity = repository.getCelebrityById(id);
        if (celebrity == null) throw new FoundByIdException($"Celebrity Id = {id}");
        return celebrity;
    });

    app.MapDelete("/Celebrities/{id:int}", (int id) =>
    {
        Celebrity celebrity = repository.getCelebrityById(id);
        if (celebrity == null)
            throw new FoundByIdException($"Celebrity with Id = {id} not found");

        bool isDeleted = repository.delCelebrityById(id);
        if (!isDeleted)
            throw new DeleteCelebrityException($"Failed to delete Celebrity with Id = {id}");

        if (repository.SaveChanges() <= 0) throw new SaveException("/Celebrities error, SaveChanges() <= 0");
    });

    app.MapPut("/Celebrities/{id:int}", (int id, Celebrity celebrity) =>
    {
        bool isUpdated = repository.updCelebrityById(id, celebrity);
        if (!isUpdated)
            throw new DeleteCelebrityException($"Failed to delete Celebrity with Id = {id}");

        if (repository.SaveChanges() <= 0) throw new SaveException("/Celebrities error, SaveChanges() <= 0");
    });

    app.MapPost("/Celebrities", (Celebrity celebrity) =>
    {
        int? id = repository.addCelebrity(celebrity);
        if (id == null) throw new AddCelebrityException("Celebrities error, id == null");
        if (repository.SaveChanges() <= 0) throw new SaveException("/Celebrities error, SaveChanges() <= 0");
        return new Celebrity((int)id, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath);
    }).AddEndpointFilter(async (context, next) =>
    {
        var celebrity = context.GetArgument<Celebrity>(0);

        if (celebrity == null) { throw new AddCelebrityException("celebrity is null"); }
        if (celebrity.Surname.Length < 2) { throw new CelebritySurnameException("celebrity surname length < 2"); }
        if (celebrity.Surname == null) { throw new CelebritySurnameException("celebrity surname is null"); }

        return await next(context);
    }).AddEndpointFilter(async (context, next) =>
    {
        var celebrity = context.GetArgument<Celebrity>(0);

        if (celebrity == null) { throw new AddCelebrityException("celebrity is null"); }
        if (repository.getCelebritiesBySurname(celebrity.Surname) != null) { throw new CelebritySurnameException("celebrity surname repeats"); }

        return await next(context);
    }).AddEndpointFilter(async (context, next) =>
    {
        var celebrity = context.GetArgument<Celebrity>(0);

        if (repository.getPhotoPathById(celebrity.Id) == null) { context.HttpContext.Response.Headers.Add("X-Celebrity", "photo is null"); throw new CelebrityPhotoPathException("error"); }
        return await next(context);
    });

    app.MapFallback((HttpContext ctx) => Results.NotFound(new { error = $"Path {ctx.Request.Path} not supported" }));

    app.Map("/Celebrities/Error", (HttpContext ctx) =>
    {
        Exception? ex = ctx.Features.Get<IExceptionHandlerFeature>()?.Error;
        IResult rc = Results.Problem(detail: "Panic", instance: app.Environment.EnvironmentName, title: "ASPA004", statusCode: 500);

        if (ex != null)
        {
            if (ex is CelebrityIsNullException) rc = Results.Problem(title: "ASPA004/AddCelebrity", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500); // 404
            if (ex is CelebrityPhotoPathException) rc = Results.Problem(title: "ASPA004/AddCelebrity", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
            if (ex is CelebritySurnameException) rc = Results.Problem(title: "ASPA004/AddCelebrity", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 409); // 404
            if (ex is DeleteCelebrityException) rc = Results.NotFound(ex.Message); // 404
            if (ex is DirectoryNotFoundException) rc = Results.Problem(title: "ASPA004", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500); // 404
            if (ex is FileNotFoundException) rc = Results.Problem(title: "ASPA004", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500); // 404
            if (ex is FoundByIdException) rc = Results.NotFound(ex.Message); // 404
            if (ex is BadHttpRequestException) rc = Results.BadRequest(ex.Message); // Ошибка в формате запроса
            if (ex is SaveException) rc = Results.Problem(title: "ASPA004/SaveChanges", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
            if (ex is AddCelebrityException) rc = Results.Problem(title: "ASPA004/AddCelebrity", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
        }

        return rc;
    });

    app.Run();
}

public class CelebrityIsNullException : Exception { public CelebrityIsNullException(string message) : base($"CelebrityIsNullException: {message}") { } };

public class CelebritySurnameException : Exception { public CelebritySurnameException(string message) : base($"CelebritySurnameException: {message}") { } };

public class CelebrityPhotoPathException : Exception { public CelebrityPhotoPathException(string message) : base($"CelebrityPhotoPathException: {message}") { } };

public class DeleteCelebrityException : Exception { public DeleteCelebrityException(string message) : base($"Delete by Id: {message}") { } };

public class FoundByIdException : Exception { public FoundByIdException(string message) : base($"Found by Id: {message}") { } };

public class SaveException : Exception { public SaveException(string message) : base($"SaveChanges error: {message}") { } };

public class AddCelebrityException : Exception { public AddCelebrityException(string message) : base($"AddCelebrityException error: {message}") { } };
