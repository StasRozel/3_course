using DAL004;

namespace ASPA005_2.Filters;

public class PutCelebrityFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var id = context.GetArgument<Celebrity>(0);
        var celebrity = context.GetArgument<Celebrity>(1);

        if (id == null) throw new InvalidCelebrityException("Enter correct id to put entity");
        if (celebrity == null) throw new AddCelebrityException("celebrity is null");

        return await next(context);
    }
}