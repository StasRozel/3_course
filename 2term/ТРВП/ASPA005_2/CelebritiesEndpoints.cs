using DAL004;
using Microsoft.AspNetCore.Diagnostics;

namespace ASPA005_2
{
    public static class CelebritiesEndpoints
    {
        public static void MapCelebritiesEndpoints(this WebApplication app)
        {
            var repository = Repository.Create("\\Сelebrities\\");
            string path = "D:\\Универ\\3course\\2term\\ТРВП\\DAL004\\DAL004\\Сelebrities\\" + Repository.JSONFileName;

            // Создаем группу маршрутов
            var celebritiesGroup = app.MapGroup("/Celebrities");

            // GET - получить всех знаменитостей
            celebritiesGroup.MapGet("", () => repository.getAllCelebrities());

            // GET - получить знаменитость по ID
            celebritiesGroup.MapGet("{id:int}", (int id) =>
            {
                Celebrity? celebrity = repository.getCelebrityById(id);
                if (celebrity == null)
                    throw new FoundByIdException($"Celebrity Id = {id}");
                return celebrity;
            });

            // POST - добавить новую знаменитость
            celebritiesGroup.MapPost("", (Celebrity celebrity) =>
            {
                if (!File.Exists(path))
                    throw new FoundFileException($"Not found path {path}");
                int? id = repository.addCelebrity(celebrity);
                if (id == null)
                    throw new AddCelebrityException("/Celebrities error, id == null");
                if (repository.SaveChanges() <= 0)
                    throw new SaveException("/Celebrities error, SaveChanges() <= 0");
                return new Celebrity((int)id, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath);
            })
            .AddEndpointFilter<ValidateCelebrityFilter>()
            .AddEndpointFilter<ValidatePhotoPathFilter>();

            // DELETE - удалить знаменитость по ID
            celebritiesGroup.MapDelete("{id:int}", (int id) =>
            {
                return repository.delCelebrityById(id);
            })
            .AddEndpointFilter<ValidateCelebrityExistsFilter>();

            // PUT - обновить знаменитость по ID
            celebritiesGroup.MapPut("{id:int}", (int id, Celebrity celebrity) =>
            {
                Celebrity? _celebrity = repository.getCelebrityById(id);

                if (_celebrity == null)
                    throw new FoundByIdException($"Celebrity Id = {id}");

                return repository.updCelebrityById(id, celebrity);
            })
            .AddEndpointFilter<ValidateCelebrityUpdateFilter>();

            // Обработчик ошибок
            app.Map("/Celebrities/Error", (HttpContext ctx) =>
            {
                Exception? ex = ctx.Features.Get<IExceptionHandlerFeature>()?.Error;
                IResult rc = Results.Problem(detail: "Panic", instance: app.Environment.EnvironmentName, title: "ASPA005", statusCode: 500);
                if (ex != null)
                {
                    if (ex is FoundByIdException)
                        rc = Results.NotFound(ex.Message);
                    if (ex is BadHttpRequestException)
                        rc = Results.BadRequest(ex.Message);
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
        }
    }
}