using DAL004;

namespace ASPA005_2.Filters;

public class GetPhotoByIdFIlter : IEndpointFilter
{
    private readonly IRepository repository = new CelebrityRepository("Сelebrities");

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var celebrity = context.GetArgument<Celebrity>(0);

        if (repository.GetPhotoPathById(celebrity.Id) == null)
        {
            context.HttpContext.Response.Headers.Add("X-Celebrity", "photo is null");
            throw new InvalidCelebrityField("photopath", "Photopath not found");
        }

        return await next(context);
    }
}