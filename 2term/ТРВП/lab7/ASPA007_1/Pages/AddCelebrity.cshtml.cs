using System.Text.Json;
using DAL_Celebrity;
using DAL_Celebrity.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ASPA007_1.Pages;

public class AddCelebrityModel : PageModel
{
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;
    private readonly IRepository<Celebrity, LifeEvent> _repository;

    public AddCelebrityModel(
        IRepository<Celebrity, LifeEvent> repository,
        IWebHostEnvironment environment,
        IConfiguration configuration)
    {
        _repository = repository;
        _environment = environment;
        _configuration = configuration;
        Countries = new SelectList(PopulateCountriesList(), "code", "countryLabel");
    }

    [BindProperty] public string FullName { get; set; }

    [BindProperty] public string Nationality { get; set; }

    [BindProperty] public IFormFile Photo { get; set; }

    public SelectList Countries { get; set; }

    public async Task<IActionResult> OnPostAsync()
    {
        if (string.IsNullOrEmpty(FullName) ||
            string.IsNullOrEmpty(Nationality) ||
            Photo == null)
        {
            var countries = PopulateCountriesList();
            Countries = new SelectList(countries, "code", "countryLabel");
            return Page();
        }

        try
        {
            var celebrity = new Celebrity
            {
                FullName = FullName,
                Nationality = Nationality
            };

            var photosFolder = _configuration.GetSection("celebrities:photos_folder").Value;

            if (string.IsNullOrEmpty(photosFolder))
                photosFolder = Path.Combine(_environment.WebRootPath, "celebrities");

            if (!Directory.Exists(photosFolder)) Directory.CreateDirectory(photosFolder);

            var fileExtension = Path.GetExtension(Photo.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(photosFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await Photo.CopyToAsync(stream);
            }

            celebrity.ReqPhotoPath = fileName;

            _repository.AddCelebrity(celebrity);

            return RedirectToPage("Index");
        }
        catch (Exception ex)
        {
            var countries = PopulateCountriesList();
            Countries = new SelectList(countries, "code", "countryLabel");
            ViewData["Message"] = $"Error: {ex.Message}";
            return Page();
        }
    }

    private static List<CountryCode> PopulateCountriesList()
    {
        try
        {
            var jsonFilePath =
                "/home/rozel/Документы/Универ/ТРВП/lab7/ASPA007_1/celebrities/assets/json/country_codes.json";
            var jsonContent = System.IO.File.ReadAllText(jsonFilePath);

            var countries = JsonSerializer.Deserialize<List<CountryCode>>(jsonContent);

            if (countries == null || !countries.Any()) return new List<CountryCode>();

            return countries;
        }
        catch (Exception)
        {
            return new List<CountryCode>();
        }
    }

    private class CountryCode
    {
        [BindProperty] public string countryLabel { get; set; }

        [BindProperty] public string code { get; set; }
    }
}