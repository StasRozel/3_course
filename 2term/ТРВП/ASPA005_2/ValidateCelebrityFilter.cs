using DAL004;

namespace ASPA005_2
{
    public class ValidateCelebrityFilter : IEndpointFilter
    {
        private readonly IRepository repository;

        public ValidateCelebrityFilter(IRepository repository)
        {
            this.repository = repository;
        }

        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
        {
            var celebrity = context.GetArgument<Celebrity>(0);
            var oldCelebrity = repository.getCelebritiesBySurname(celebrity.Surname);
            if (celebrity == null)
                throw new ValueNullCelebrityException("The celebrity object cannot be null.");
            if (oldCelebrity.Length != 0)
                throw new FieldNullCelebrityException("This Surname is already in use");
            return await next(context);
        }
    }
}