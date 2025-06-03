using DAL004;

namespace ASPA005_2
{
    public class ValidatePhotoPathFilter : IEndpointFilter
    {
        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
        {
            var celebrity = context.GetArgument<Celebrity>(0);
            if (celebrity == null)
                return Results.Problem("The celebrity object cannot be null.", statusCode: 500);
            var basePath = "BasePath"; // Укажите правильный путь
            var photoPath = Path.Combine(basePath, celebrity.PhotoPath);
            if (!File.Exists(photoPath))
            {
                var fileName = Path.GetFileName(celebrity.PhotoPath);
                // Вариант с HttpContext
                context.HttpContext.Response.Headers.Add("X-Celebrity", $" not found {fileName}");
                return Results.Problem($"File not found: {fileName}", statusCode: 404);
            }
            return await next(context);
        }
    }
}
