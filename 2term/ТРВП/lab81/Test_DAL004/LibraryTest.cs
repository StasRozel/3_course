using DAL004;

namespace Test_DAL004;

public class LibraryTest
{
    public static void Main(string[] args)
    {
        using (var repository = CelebrityRepositoryFactory.Create("Сelebrities"))
        {
            void print(string label)
            {
                Console.WriteLine($"-------- {label} -----------");
                foreach (var celebrity in repository.GetAllCelebrities())
                    Console.WriteLine($"Id = {celebrity.Id}, Firstname = {celebrity.Firstname}, " +
                                      $"Surname = {celebrity.Surname}, PhotoPath = {celebrity.PhotoPath}");
            }

            print("start");

            var testId1 = repository.AddCelebrity(new Celebrity(0, "TestID1", "TestID1", "Photo/TestID1.jpg"));
            var testId2 = repository.AddCelebrity(new Celebrity(0, "TestID2", "TestID2", "Photo/TestID2.jpg"));
            var testId3 = repository.AddCelebrity(new Celebrity(0, "TestID3", "TestID3", "Photo/TestID3.jpg"));
            var testId4 = repository.AddCelebrity(new Celebrity(0, "TestID4", "TestID4", "Photo/TestID4.jpg"));

            repository.SaveChanges();

            print("add");

            if (testId1 != null)
            {
                if (repository.DeleteCelebrityById((int)testId1)) Console.WriteLine($"delete {testId1}");
                else Console.WriteLine($"delete {testId1} error");
            }

            if (testId2 != null)
            {
                if (repository.DeleteCelebrityById((int)testId2)) Console.WriteLine($"delete {testId2}");
                else Console.WriteLine($"delete {testId2} error");
            }

            if (repository.DeleteCelebrityById(1000)) Console.WriteLine("delete 1000");
            else Console.WriteLine("delete 1000 error");

            print("del 2");

            if (testId1 != null)
            {
                if (repository.UpdateCelebrityById((int)testId1,
                        new Celebrity(0, "Updated1", "Updated1", "Photo/Updated1.jpg")) != null)
                    Console.WriteLine($"update {testId1}");
                else Console.WriteLine($"update {testId1} error");
            }

            if (testId2 != null)
            {
                if (repository.UpdateCelebrityById((int)testId2,
                        new Celebrity(0, "Updated2", "Updated2", "Photo/Updated2.jpg")) != null)
                    Console.WriteLine($"update {testId2}");
                else Console.WriteLine($"update {testId2} error");
            }

            if (repository.UpdateCelebrityById(1000,
                    new Celebrity(0, "Updated1000", "Updated1000", "Photo/Updated1000.jpg")) != null)
                Console.WriteLine("update 1000");
            else Console.WriteLine("update 1000 error");

            repository.SaveChanges();

            print("upd 2");
        }
    }
}