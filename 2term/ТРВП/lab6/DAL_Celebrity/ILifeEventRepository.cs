namespace DAL_Celebrity;

public interface ILifeEventRepository<TLifeEvent> : IDisposable
{
    List<TLifeEvent> GetAllLifeEvents();
    TLifeEvent? GetLifeEventById(int id);
    bool DeleteLifeEvent(int id);
    bool AddLifeEvent(TLifeEvent lifeEvent);
    bool UpdateLifeEvent(int id, TLifeEvent lifeEvent);
}