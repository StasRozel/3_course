using Microsoft.AspNetCore.HttpLogging;

namespace ASPA001; // Namespace of the project

public static class App // Class name for App
{
    public static void Main(string[] args) // Main method
    {
        var builder = WebApplication.CreateBuilder(args); // Create a new instance of WebApplicationBuilder
        builder.Services.AddHttpLogging(options => { options.LoggingFields = HttpLoggingFields.All; }); // Add HttpLogging to the services

        var app = builder.Build(); // Build the application

        app.UseHttpLogging(); // Use HttpLogging Middleware
        app.MapGet("/", () => "My first ASPA"); // Map the root path, return simple text

        app.Run(); // Run the application
    }
}