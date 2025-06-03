using DAL004;

namespace ASPA005_2
{
    public class ValidateCelebrityUpdateFilter : IEndpointFilter
    {
        private readonly IRepository repository;

        public ValidateCelebrityUpdateFilter(IRepository repository)
        {
            this.repository = repository;
        }

        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
        {
            var id = context.GetArgument<int>(0);
            var celebrity = context.GetArgument<Celebrity>(1);

            // Проверка существования celebrity по id
            var existingCelebrity = repository.getCelebrityById(id);
            if (existingCelebrity == null)
                return Results.NotFound($"Celebrity with Id = {id} not found");

            // Проверка корректности данных в celebrity
            if (celebrity == null)
                return Results.BadRequest("The celebrity object cannot be null");

            // Можно добавить дополнительные проверки, например на пустые поля
            if (string.IsNullOrEmpty(celebrity.Firstname) || string.IsNullOrEmpty(celebrity.Surname))
                return Results.BadRequest("Firstname and Surname cannot be empty");

            return await next(context);
        }
    }
}
