namespace DAL_Celebrity;

public interface ICelebrityRepository<TCelebrity> : IDisposable
{
    List<TCelebrity> GetAllCelebrities();
    TCelebrity? GetCelebrityById(int id);
    bool DeleteCelebrity(int id);
    bool AddCelebrity(TCelebrity celebrity);
    bool UpdateCelebrity(int id, TCelebrity celebrity);
    int FindCelebrityIdByName(string name);
}