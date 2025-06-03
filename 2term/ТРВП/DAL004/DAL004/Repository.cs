using DAL004;
using System.Text.Json;

namespace DAL004
{
    public class Repository : IRepository
    {
        private static List<Celebrity> _celebrities;

        public static string JSONFileName { get; set; }

        public static string BasePath { get; set; }

        string currentDirectory = "D:\\Универ\\3course\\2term\\ТРВП\\DAL004\\DAL004";

        public static Repository Create(string jsonDirectoryPath)
        {
            // Получаем абсолютный путь к текущей директории
            string currentDirectory = "D:\\Универ\\3course\\2term\\ТРВП\\DAL004\\DAL004";


            // Формируем полный путь к директории с учетом текущей директории
            string fullDirectoryPath = Path.GetFullPath(jsonDirectoryPath, currentDirectory);

            // Формируем полный путь к файлу
            BasePath = currentDirectory + jsonDirectoryPath + JSONFileName;

            // Читаем JSON-файл и десериализуем данные
            if (File.Exists(BasePath))
            {
                string jsonData = File.ReadAllText(BasePath);
                _celebrities = JsonSerializer.Deserialize<List<Celebrity>>(jsonData) ?? new List<Celebrity>();
            }
            else
            {
                _celebrities = new List<Celebrity>();
            }

            return new Repository();
        }

        public void Dispose()
        {
            // Освобождение ресурсов, если потребуется
        }

        public Celebrity[] getAllCelebrities()
        {
            return _celebrities.ToArray();
        }

        public Celebrity[] getCelebritiesBySurname(string surname)
        {
            return _celebrities
                .Where(c => string.Equals(c.Surname, surname, StringComparison.OrdinalIgnoreCase))
                .ToArray();
        }

        public Celebrity? getCelebrityById(int id)
        {
            return _celebrities.FirstOrDefault(c => c.Id == id);
        }

        public string? getPhotoPathById(int id)
        {
            return _celebrities.FirstOrDefault(c => c.Id == id)?.PhotoPath;
        }

        public int addCelebrity(Celebrity celebrity)
        {
            if (celebrity == null || _celebrities.Any(c => c.Id == celebrity.Id))
                return -1;
            celebrity.Id = _celebrities.Count + 1;
            _celebrities.Add(celebrity);
            return celebrity.Id;
        }

        // Удалить знаменитость по Id
        public bool delCelebrityById(int id)
        {
            var celebrity = _celebrities.FirstOrDefault(c => c.Id == id);
            if (celebrity == null)
                return false;

            _celebrities.Remove(celebrity);
            return true;
        }

        // Обновить знаменитость по Id
        public bool updCelebrityById(int id, Celebrity celebrity)
        {
            Celebrity? existingCelebrity = _celebrities.FirstOrDefault(c => c.Id == id);
            if (existingCelebrity == null || celebrity == null)
                return false;

            existingCelebrity.Id = id;
            existingCelebrity.Surname = celebrity.Surname;
            existingCelebrity.Firstname = celebrity.Firstname;
            existingCelebrity.PhotoPath = celebrity.PhotoPath;
            return true; // Возвращаем количество измененных записей
        }

        // Сохранить изменения в JSON
        public int SaveChanges()
        {
            string path = currentDirectory + "\\Сelebrities\\" + JSONFileName;
            var json = JsonSerializer.Serialize(_celebrities, new JsonSerializerOptions { WriteIndented = true });
            if (File.Exists(path)) File.WriteAllText(path, json);
            else Console.WriteLine("Aboba"); 
            return _celebrities.Count; // Возвращаем количество записей в JSON
        }
    }
}
