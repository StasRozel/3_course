namespace DAL004;

public interface IRepository : IDisposable
{
    string BasePath { get; } 
    Celebrity[] GetAllCelebrities();
    Celebrity? GetCelebrityById(int id);
    Celebrity? GetCelebritiesBySurname(string surname);
    string? GetPhotoPathById(int id);
    int? AddCelebrity(Celebrity celebrity);
    bool DeleteCelebrityById(int id);
    int? UpdateCelebrityById(int id, Celebrity celebrity);
    int SaveChanges();
}

public record Celebrity(int Id, string Firstname, string Surname, string PhotoPath)
{
    public override string ToString()
    {
        return $"{Firstname} {Surname}, ID: {Id}, Photo: {PhotoPath}";
    }
    
    public Celebrity WithUpdatedPhotoPath(string newPhotoPath) => this with { PhotoPath = newPhotoPath };
    public Celebrity WithUpdatedFirstName(string newFirstName) => this with { Firstname = newFirstName };
    public Celebrity WithUpdatedSurname(string newSurname) => this with { Surname = newSurname };
}