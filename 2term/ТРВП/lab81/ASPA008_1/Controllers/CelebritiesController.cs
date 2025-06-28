using ANC25_WEBAPI_DLL;
using ASPA008_1.Filters;
using ASPA008_1.Models;
using DAL_Celebrity;
using DAL_Celebrity.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ASPA008_1.Controllers;

public class CelebritiesController : Controller
{
    private readonly IConfiguration _configuration;
    private readonly CountryCodesProvider _countryCodesProvider;
    private readonly IWebHostEnvironment _environment;
    private readonly IRepository<Celebrity, LifeEvent> _repository;

    public CelebritiesController(
        IRepository<Celebrity, LifeEvent> repository,
        IWebHostEnvironment environment,
        IConfiguration configuration)
    {
        _repository = repository;
        _environment = environment;
        _configuration = configuration;

        var jsonFilePath = _configuration.GetSection("celebrities:iso3166_country_codes").Value;
        if (string.IsNullOrEmpty(jsonFilePath))
            jsonFilePath = Path.Combine(_environment.WebRootPath, "assets", "json", "country_codes.json");

        _countryCodesProvider = new CountryCodesProvider(jsonFilePath);
    }

    [Route("/")]
    public IActionResult Index()
    {
        ViewData["Title"] = "Celebrities";

        var viewModel = new CelebritiesViewModel
        {
            Celebrities = _repository.GetAllCelebrities()
        };

        return View(viewModel);
    }

    [HttpGet]
    [Route("/AddCelebrity")]
    public IActionResult AddCelebrity()
    {
        ViewData["Title"] = "Add Celebrity";

        var viewModel = new AddCelebrityViewModel
        {
            Countries = new SelectList(_countryCodesProvider.GetAllCountryCodes(), "code", "countryLabel")
        };

        return View(viewModel);
    }

    [HttpPost]
    [Route("/AddCelebrity")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AddCelebrity(AddCelebrityViewModel model)
    {
        if (string.IsNullOrEmpty(model.FullName) ||
            string.IsNullOrEmpty(model.Nationality) ||
            model.Photo == null)
        {
            model.Countries = new SelectList(GetCountryCodes(), "Code", "CountryLabel");
            return View(model);
        }

        try
        {
            var celebrity = new Celebrity
            {
                FullName = model.FullName,
                Nationality = model.Nationality
            };

            var photosFolder = _configuration.GetSection("celebrities:photos_folder").Value;

            if (string.IsNullOrEmpty(photosFolder))
                photosFolder = Path.Combine(_environment.WebRootPath, "celebrities");

            if (!Directory.Exists(photosFolder)) Directory.CreateDirectory(photosFolder);

            var fileExtension = Path.GetExtension(model.Photo.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(photosFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await model.Photo.CopyToAsync(stream);
            }

            celebrity.ReqPhotoPath = fileName;

            _repository.AddCelebrity(celebrity);

            return RedirectToAction("Index");
        }
        catch (Exception ex)
        {
            model.Countries = new SelectList(GetCountryCodes(), "Code", "CountryLabel");
            ViewData["Message"] = $"Error: {ex.Message}";
            return View(model);
        }
    }

    private List<CountryCode> GetCountryCodes()
    {
        return _countryCodesProvider.GetAllCountryCodes().ToList();
    }


    [HttpGet]
    [Route("/UpdateCelebrity/{id}")]
    public IActionResult UpdateCelebrity(int id)
    {
        var celebrity = _repository.GetCelebrityById(id);

        if (celebrity == null) return NotFound();

        ViewData["Title"] = $"Update {celebrity.FullName}";

        var viewModel = new UpdateCelebrityViewModel
        {
            Id = celebrity.Id,
            FullName = celebrity.FullName,
            Nationality = celebrity.Nationality,
            ExistingPhotoPath = celebrity.ReqPhotoPath,
            Countries = new SelectList(_countryCodesProvider.GetAllCountryCodes(), "code", "countryLabel")
        };

        return View(viewModel);
    }

    [HttpPost]
    [Route("/UpdateCelebrity/{id}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateCelebrity(UpdateCelebrityViewModel model)
    {
        if (string.IsNullOrEmpty(model.FullName) || string.IsNullOrEmpty(model.Nationality))
        {
            model.Countries = new SelectList(_countryCodesProvider.GetAllCountryCodes(), "code", "countryLabel");
            return View(model);
        }

        try
        {
            var celebrity = _repository.GetCelebrityById(model.Id);
            if (celebrity == null) return NotFound();

            celebrity.FullName = model.FullName;
            celebrity.Nationality = model.Nationality;

            if (model.Photo != null && model.Photo.Length > 0)
            {
                var photosFolder = _configuration.GetSection("celebrities:photos_folder").Value;

                if (string.IsNullOrEmpty(photosFolder))
                    photosFolder = Path.Combine(_environment.WebRootPath, "celebrities");

                if (!Directory.Exists(photosFolder)) Directory.CreateDirectory(photosFolder);

                if (!string.IsNullOrEmpty(celebrity.ReqPhotoPath))
                {
                    var oldFilePath = Path.Combine(photosFolder, celebrity.ReqPhotoPath);
                    if (System.IO.File.Exists(oldFilePath)) System.IO.File.Delete(oldFilePath);
                }

                var fileExtension = Path.GetExtension(model.Photo.FileName);
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(photosFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.Photo.CopyToAsync(stream);
                }

                celebrity.ReqPhotoPath = fileName;
            }

            _repository.UpdateCelebrity(model.Id, celebrity);

            return RedirectToAction("Index");
        }
        catch (Exception ex)
        {
            model.Countries = new SelectList(_countryCodesProvider.GetAllCountryCodes(), "code", "countryLabel");
            ViewData["Message"] = $"Error: {ex.Message}";

            return View(model);
        }
    }

    [HttpGet]
    [Route("/ViewCelebrity/{id}")]
    [WikipediaLinks]
    public IActionResult ViewCelebrity(int id)
    {
        var celebrity = _repository.GetCelebrityById(id);

        if (celebrity == null) return NotFound();

        return View(celebrity);
    }

    [HttpPost]
    [Route("/DeleteCelebrity/{id}")]
    [ValidateAntiForgeryToken]
    public IActionResult DeleteCelebrity(int id)
    {
        var celebrity = _repository.GetCelebrityById(id);

        if (celebrity == null) return NotFound();

        try
        {
            var photosFolder = _configuration.GetSection("celebrities:photos_folder").Value;
            if (string.IsNullOrEmpty(photosFolder))
                photosFolder = Path.Combine(_environment.WebRootPath, "celebrities");

            if (!string.IsNullOrEmpty(celebrity.ReqPhotoPath))
            {
                var photoPath = Path.Combine(photosFolder, celebrity.ReqPhotoPath);
                if (System.IO.File.Exists(photoPath)) System.IO.File.Delete(photoPath);
            }

            _repository.DeleteCelebrity(id);

            return RedirectToAction("Index");
        }
        catch (Exception ex)
        {
            ViewData["ErrorMessage"] = $"Error deleting celebrity: {ex.Message}";
            return View("ViewCelebrity", celebrity);
        }
    }
}