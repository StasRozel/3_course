using DAL004;
using Microsoft.AspNetCore.Diagnostics;

namespace ASPA004_1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            Repository.JSONFileName = "—elebrities.json"; // ËÏˇ Ù‡ÈÎ‡
            string path = "D:\\”ÌË‚Â\\3course\\2term\\“–¬œ\\DAL004\\DAL004\\—elebrities\\" + Repository.JSONFileName;
            using (IRepository repository = Repository.Create("\\—elebrities\\"))
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
                    IResult rc = Results.Problem(detail: "Panic", instance: app.Environment.EnvironmentName, title: "ASPA004", statusCode: 500);
                    if (ex != null)
                    {
                        if (ex is FoundByIdException)
                            rc = Results.NotFound(ex.Message); // 404 - ÌÂ Ì‡È‰ÂÌ
                        if (ex is BadHttpRequestException)
                            rc = Results.BadRequest(ex.Message); // 400 - Ó¯Ë·Í‡ ‚ ÙÓÏ‡ÚÂ Á‡ÔÓÒ‡
                        if (ex is SaveException)
                            rc = Results.Problem(title: "ASPA004/SaveChanges", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
                        if (ex is AddCelebrityException)
                            rc = Results.Problem(title: "ASPA004/addCelebrity", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
                        if (ex is FoundFileException)
                            rc = Results.Problem(title: "ASPA004/addCelebrity", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
                        if (ex is DeleteCelebrityException)
                            rc = Results.NotFound(ex.Message);
                    }
                    return rc;
                });

                app.Run();
            }
        }
}
   
}
