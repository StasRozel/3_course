using Microsoft.AspNetCore.Mvc.Rendering;

namespace ASPA008_1.Models;

public class AddCelebrityViewModel
{
    public string FullName { get; set; }
    public string Nationality { get; set; }
    public IFormFile Photo { get; set; }
    public SelectList Countries { get; set; }
}