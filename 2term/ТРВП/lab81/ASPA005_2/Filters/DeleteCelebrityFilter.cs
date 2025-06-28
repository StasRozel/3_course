using DAL004;

namespace ASPA005_2.Filters;

public class DeleteCelebrityFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var id = context.GetArgument<Celebrity>(0);
        if (id == null) throw new InvalidCelebrityException("Enter correct id to delete entity");

        return await next(context);
    }
}