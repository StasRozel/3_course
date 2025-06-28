using Newtonsoft.Json;

namespace DAL004;

public class CelebrityRepository : IRepository
{
    private readonly string jsonFilePath;

    public CelebrityRepository(string directoryName)
    {
        BasePath = Path.Combine("/home/alexei/Documents/bstu/ASP_NET_CORE/ASPA/DAL004/", directoryName);
        jsonFilePath = Path.Combine(BasePath, JsonFileName);

        if (!Directory.Exists(BasePath))
            throw new ArgumentException(
                "Directory must be situated on the same level as the repository and must exist.");
    }

    public static string JsonFileName { get; } = "Сelebrities.json";
    public string BasePath { get; }

    public void Dispose()
    {
        // No resources to dispose of in this implementation
    }

    public Celebrity[] GetAllCelebrities()
    {
        CheckFileExists();
        return FetchCelebritiesFromJson().ToArray();
    }

    public Celebrity? GetCelebrityById(int id)
    {
        CheckFileExists();
        return FetchCelebritiesFromJson().FirstOrDefault(c => c.Id == id);
    }

    public Celebrity? GetCelebritiesBySurname(string surname)
    {
        CheckFileExists();
        return FetchCelebritiesFromJson().FirstOrDefault(c => c.Surname == surname);
    }

    public string? GetPhotoPathById(int id)
    {
        return GetCelebrityById(id)?.PhotoPath;
    }

    public int? AddCelebrity(Celebrity celebrity)
    {
        CheckFileExists();
        var celebrities = FetchCelebritiesFromJson();

        var newId = celebrities.Count > 0 ? celebrities.Max(c => c.Id) + 1 : 1;
        celebrity = celebrity with { Id = newId };

        celebrities.Add(celebrity);
        SaveCelebritiesToJson(celebrities);
        return celebrity.Id;
    }


    public bool DeleteCelebrityById(int id)
    {
        CheckFileExists();
        var celebrities = FetchCelebritiesFromJson();
        var celebrityToRemove = celebrities.FirstOrDefault(c => c.Id == id);

        if (celebrityToRemove == null) return false;

        celebrities.Remove(celebrityToRemove);
        SaveCelebritiesToJson(celebrities);
        return true;
    }

    public int? UpdateCelebrityById(int id, Celebrity celebrity)
    {
        CheckFileExists();
        var celebrities = FetchCelebritiesFromJson();
        var existingIndex = celebrities.FindIndex(c => c.Id == id);

        if (existingIndex == -1) return null;

        celebrities[existingIndex] = celebrities[existingIndex]
            .WithUpdatedPhotoPath(celebrity.PhotoPath)
            .WithUpdatedSurname(celebrity.Surname)
            .WithUpdatedFirstName(celebrity.Firstname);

        SaveCelebritiesToJson(celebrities);
        return id;
    }

    public int SaveChanges()
    {
        CheckFileExists();
        return FetchCelebritiesFromJson().ToArray().Length > 30 ? 0 : 1;
    }

    private List<Celebrity> FetchCelebritiesFromJson()
    {
        CheckFileExists();
        if (!File.Exists(jsonFilePath)) return new List<Celebrity>();

        var jsonFromFile = File.ReadAllText(jsonFilePath);
        return JsonConvert.DeserializeObject<List<Celebrity>>(jsonFromFile) ?? new List<Celebrity>();
    }

    private void SaveCelebritiesToJson(List<Celebrity> celebrities)
    {
        CheckFileExists();
        var jsonToFile = JsonConvert.SerializeObject(celebrities, Formatting.Indented);
        File.WriteAllText(jsonFilePath, jsonToFile);
    }

    private void CheckFileExists()
    {
        if (!File.Exists(jsonFilePath))
            throw new FileNotFoundException($"The file '{JsonFileName}' does not exist in the directory '{BasePath}'.");
    }
}