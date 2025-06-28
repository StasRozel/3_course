using DAL004;

namespace ASPA005_2.Filter
{
    public class addCelebrityFilter : IEndpointFilter
    {
        IRepository repository = new Repository("Celebrities");

        public async ValueTask<object?> InvokeAsync(Microsoft.AspNetCore.Http.EndpointFilterInvocationContext context, Microsoft.AspNetCore.Http.EndpointFilterDelegate next)
        {
            var celebrity = context.GetArgument<Celebrity>(0);

            if (celebrity == null) { throw new AddCelebrityException("celebrity is null"); }
            if (celebrity.Surname.Length < 2) { throw new CelebritySurnameException("celebrity surname length < 2"); }
            if (celebrity.Surname == null) { throw new CelebritySurnameException("celebrity surname is null"); }
            if (repository.getCelebritiesBySurname(celebrity.Surname) != null) { throw new CelebritySurnameException("celebrity surname repeats"); }
            return await next(context);
        }
    }

    public class deleteFilter : IEndpointFilter 
    {
        IRepository repository = new Repository("Celebrities");

        public async ValueTask<object?> InvokeAsync(Microsoft.AspNetCore.Http.EndpointFilterInvocationContext context, Microsoft.AspNetCore.Http.EndpointFilterDelegate next)
        {
            var id = context.GetArgument<Celebrity>(0);

            if (id == null) { throw new CelebrityIdIsNullException("id is null"); }
            return await next(context);
        }
    }

    public class putFilter : IEndpointFilter
    {
        IRepository repository = new Repository("Celebrities");

        public async ValueTask<object?> InvokeAsync(Microsoft.AspNetCore.Http.EndpointFilterInvocationContext context, Microsoft.AspNetCore.Http.EndpointFilterDelegate next)
        {
            var id = context.GetArgument<Celebrity>(0);
            var celebrity = context.GetArgument<Celebrity>(1);

            if (id == null) { throw new CelebrityIdIsNullException("id is null"); }
            if (celebrity == null) { throw new AddCelebrityException("celebrity is null"); }
            return await next(context);
        }
    }

    public class getPhotoFilter : IEndpointFilter
    {
        IRepository repository = new Repository("Celebrities");

        public async ValueTask<object?> InvokeAsync(Microsoft.AspNetCore.Http.EndpointFilterInvocationContext context, Microsoft.AspNetCore.Http.EndpointFilterDelegate next)
        {
            var celebrity = context.GetArgument<Celebrity>(0);

            if (repository.getPhotoPathById(celebrity.Id) == null) { context.HttpContext.Response.Headers.Add("X-Celebrity", "photo is null"); throw new CelebrityPhotoPathException("error"); }
            return await next(context);
        }
    }
}
