using DAL004;

namespace ASPA005_2.Filters;

public class AddCelebrityFilter : IEndpointFilter
{
    private readonly IRepository repository = new CelebrityRepository("Сelebrities");

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var celebrity = context.GetArgument<Celebrity>(0);

        if (celebrity == null) throw new AddCelebrityException("celebrity is null");
        if (celebrity.Surname.Length < 2) throw new InvalidCelebrityField("surname", "length < 2");
        if (celebrity.Surname == null) throw new InvalidCelebrityField("surname", "field is required");

        if (repository.GetCelebritiesBySurname(celebrity.Surname) != null)
            throw new InvalidCelebrityField("surname", "User with this surname already exists");

        return await next(context);
    }
}