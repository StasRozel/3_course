using DAL004;

namespace ASPA
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Repository.JSONFileName = "Сelebrities.json"; // имя файла
            using (IRepository repository = Repository.Create("\\Сelebrities\\")) // директория (в текущем директории приложения)
            {
                foreach (Celebrity celebrity in repository.getAllCelebrities())
                {
                    Console.WriteLine($"Id = {celebrity.Id}, Surname = {celebrity.Surname}, PhotoPath = {celebrity.PhotoPath}");
                }

                Console.WriteLine("----------------");

                Console.WriteLine($"Name = {repository.getAllCelebrities()[0].Firstname}, PhotoPath = {repository.getPhotoPathById(1)}");

                Console.WriteLine("----------------");

                const int TEST_ID = 1000;

                int testDel1 = repository.addCelebrity(new Celebrity(8, "testDel1", "testDel1", "photo/testDel1.jpg"));
                int testDel2 = repository.addCelebrity(new Celebrity(9, "testDel2", "testDel2", "photo/testDel2.jpg"));
                int testUpd1 = repository.addCelebrity(new Celebrity(1000, "testUpd1", "testUpd1", "photo/testUpd1.jpg"));
                int testUpd2 = repository.addCelebrity(new Celebrity(1001, "testUpd2", "testUpd2", "photo/testUpd2.jpg"));
                repository.SaveChanges();

                foreach (Celebrity celebrity in repository.getAllCelebrities())
                {
                    Console.WriteLine($"Id = {celebrity.Id}, Surname = {celebrity.Surname}, PhotoPath = {celebrity.PhotoPath}");
                }


                Console.WriteLine("----------------");

                if (testDel1 != null)
                {
                    if (repository.delCelebrityById(testDel1)) Console.WriteLine($"delete (testDel1)");
                    else Console.WriteLine($"delete (testDel1) error");
                    if (repository.delCelebrityById(9)) Console.WriteLine($"delete (9)");
                    else Console.WriteLine($"delete (9) error");
                    repository.SaveChanges();
                }

                Console.WriteLine("----------------");

                if (testUpd1 != null)
                {
                    if (repository.updCelebrityById((int)testUpd1, new Celebrity(8, "updated", "updated", "photo/updated.jpg"))) Console.WriteLine($"update (testUpd1)");
                    else Console.WriteLine($"update (testUpd1) error");
                    if (repository.updCelebrityById((int)testUpd2, new Celebrity(8, "updated2", "updated2", "photo/updated2.jpg"))) Console.WriteLine($"update (testUpd2)");
                    else Console.WriteLine($"update (testUpd2) error");
                    if (repository.updCelebrityById(1000, new Celebrity(1000, "updated1000", "updated1000", "photo/updated1000.jpg"))) Console.WriteLine($"update (1000)");
                    else Console.WriteLine($"update (1000) error");
                    repository.SaveChanges();
                }

                Console.WriteLine("----------------");

                foreach (Celebrity celebrity in repository.getAllCelebrities())
                {
                    Console.WriteLine($"Id = {celebrity.Id}, Surname = {celebrity.Surname}, PhotoPath = {celebrity.PhotoPath}");
                }

            }
        }
    }
}
