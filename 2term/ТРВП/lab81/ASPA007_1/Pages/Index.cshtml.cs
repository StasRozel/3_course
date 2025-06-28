using DAL_Celebrity;
using DAL_Celebrity.Entity;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ASPA007_1.Pages;

public class Index : PageModel
{
    private readonly IRepository<Celebrity, LifeEvent> _repository;

    public Index(IRepository<Celebrity, LifeEvent> repository)
    {
        _repository = repository;
    }

    public List<Celebrity> Celebrities { get; private set; } = new();

    public void OnGet()
    {
        Celebrities = _repository.GetAllCelebrities();
    }
}