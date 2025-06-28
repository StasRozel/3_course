namespace DAL003;

public interface IRepository : IDisposable
{
    string BasePath { get; } 
    Celebrity[] GetAllCelebrities();
    Celebrity? GetCelebrityById(int id);
    Celebrity? GetCelebritiesBySurname(string surname);
    string? GetPhotoPathById(int id);
}

public record Celebrity(int Id, string Firstname, string Surname, string PhotoPath)
{
    public override string ToString()
    {
        return $"{Firstname} {Surname}, ID: {Id}, Photo: {PhotoPath}";
    }
}

