using DAL004;

namespace ASPA005_2
{
    public class ValidateCelebrityExistsFilter : IEndpointFilter
    {
        private readonly IRepository repository;

        public ValidateCelebrityExistsFilter(IRepository repository)
        {
            this.repository = repository;
        }

        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
        {
            var id = context.GetArgument<int>(0);
            var celebrity = repository.getCelebrityById(id);
            if (celebrity == null)
                return Results.NotFound($"Celebrity with Id = {id} not found");

            return await next(context);
        }
    }
}
