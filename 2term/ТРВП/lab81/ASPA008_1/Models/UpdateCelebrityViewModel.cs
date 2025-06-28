using Microsoft.AspNetCore.Mvc.Rendering;

namespace ASPA008_1.Models;

public class UpdateCelebrityViewModel
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Nationality { get; set; }
    public IFormFile? Photo { get; set; }
    public string? ExistingPhotoPath { get; set; }
    public SelectList Countries { get; set; }
}