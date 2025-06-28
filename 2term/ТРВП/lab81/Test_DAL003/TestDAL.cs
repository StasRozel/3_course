
using DAL003;

public class TestDAL
{

    private static void Main(string[] args)
    {
        using (IRepository repository = CelebrityRepositoryFactory.Create("Сelebrities"))
        {
            foreach (Celebrity celebrity in repository.GetAllCelebrities())
            {
                Console.WriteLine(celebrity);
            }

            Celebrity? foundCelebrity = repository.GetCelebrityById(1);
            Console.WriteLine(foundCelebrity);
            Console.WriteLine(repository.GetCelebritiesBySurname("Neumann"));
            Console.WriteLine(repository.GetPhotoPathById(2));
        }
    }
        

}