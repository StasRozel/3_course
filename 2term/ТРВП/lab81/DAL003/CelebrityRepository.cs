using Newtonsoft.Json;

namespace DAL003;

public class CelebrityRepository: IRepository
{
    public static string JsonFileName { get; } = "Сelebrities.json";
    private string jsonFilePath;
    public string BasePath { get; }

    public CelebrityRepository(string directoryName)
    {
        BasePath = Path.Combine("/home/alexei/Documents/bstu/ASP_NET_CORE/ASPA/DAL003", directoryName);
        jsonFilePath = Path.Combine(BasePath, JsonFileName);
        
        if (!Directory.Exists(BasePath))
        {
            throw new ArgumentException("Directory must be situated on ones level with repository and must be exists");
        }
    }
    
    public void Dispose()
    {
        
    }

    public Celebrity[] GetAllCelebrities()
    {
        return FetchCelebritiesFromJson().ToArray();
    }

    public Celebrity? GetCelebrityById(int id)
    {
        return FetchCelebritiesFromJson().ToArray().FirstOrDefault(c => c.Id == id);
    }

    public Celebrity? GetCelebritiesBySurname(string surname)
    {
        return FetchCelebritiesFromJson().ToArray().FirstOrDefault(c => c.Surname == surname);
    }

    public string? GetPhotoPathById(int id)
    {
        return GetCelebrityById(id)?.PhotoPath;
    }

    private List<Celebrity> FetchCelebritiesFromJson()
    {
        if (!File.Exists(jsonFilePath))
        {
            throw new FileNotFoundException($"Json file ({jsonFilePath}) is not exists.");
        }

        var jsonFromFile = File.ReadAllText(jsonFilePath);
        return JsonConvert.DeserializeObject<List<Celebrity>>(jsonFromFile) ?? new List<Celebrity>();
    }
}
