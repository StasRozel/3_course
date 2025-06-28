namespace DAL004;

public static class CelebrityRepositoryFactory
{
    public static IRepository Create(string directoryName)
    {
        return new CelebrityRepository(directoryName);
    }
}