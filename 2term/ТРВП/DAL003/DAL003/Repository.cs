using System.Text.Json;

namespace DAL003
{
    public class Repository : IRepository
    {
        private static List<Celebrity> _celebrities;

        public static string JSONFileName { get; set; }

        public static string BasePath { get; set; }

        public static Repository Create(string jsonDirectoryPath)
        {
            // Получаем абсолютный путь к текущей директории
            string currentDirectory = "D:\\Универ\\3course\\2term\\ТРВП\\DAL003\\DAL003";


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
    }
}
