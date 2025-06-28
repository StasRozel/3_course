using DAL_Celebrity;
using DAL_Celebrity.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ASPA007_1.Pages;

public class ViewCelebrityModel : PageModel
{
    private readonly IRepository<Celebrity, LifeEvent> _repository;

    public ViewCelebrityModel(IRepository<Celebrity, LifeEvent> repository)
    {
        _repository = repository;
    }

    public Celebrity Celebrity { get; private set; }

    public IActionResult OnGet(int id)
    {
        Celebrity = _repository.GetCelebrityById(id);

        if (Celebrity == null) return NotFound();

        return Page();
    }
}