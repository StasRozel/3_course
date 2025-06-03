using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL003
{
    public interface IRepository : IDisposable
    {
        static string BasePath { get; } // полный дирректорий для JSON и фотографий
        Celebrity[] getAllCelebrities(); // получить весь список знаменитостей
        Celebrity? getCelebrityById(int id); // получить знаменитость по Id
        Celebrity[] getCelebritiesBySurname(string Surname); // получить знаменитость по фамилии
        string? getPhotoPathById(int id); // получить путь для GET-запроса к фотографии
    }

    public record Celebrity(int Id, string Firstname, string Surname, string PhotoPath);
}
