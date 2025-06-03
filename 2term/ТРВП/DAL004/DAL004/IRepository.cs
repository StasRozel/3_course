using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL004
{
    public interface IRepository : IDisposable
    {
        static string BasePath { get; } // полный адрес директории для JSON и фотографий

        Celebrity[] getAllCelebrities(); // получить весь список знаменитостей по Id

        Celebrity[] getCelebritiesBySurname(string Surname); // получить знаменитостей по фамилии

        string getPhotoPathById(int id); // получить путь для GET-запроса к фотографии

        int addCelebrity(Celebrity celebrity); // добавить знаменитость, по id = true - успешно

        bool delCelebrityById(int id); // удалить знаменитость по id, true - успех
        Celebrity? getCelebrityById(int id);
        bool updCelebrityById(int id, Celebrity celebrity); // изменить знаменитость по id, true - успех - успех

        int SaveChanges(); // сохранить изменения в JSON, количество изменений
    }

    public class Celebrity
    {
        public int Id { get; set; }
        public string Surname { get; set; }
        public string Firstname { get; set; }
        public string PhotoPath { get; set; }

        public Celebrity(int Id, string Surname, string Firstname, string PhotoPath)
        {
            this.Id = Id;
            this.Surname = Surname;
            this.Firstname = Firstname;
            this.PhotoPath = PhotoPath;
        }
    }
}
