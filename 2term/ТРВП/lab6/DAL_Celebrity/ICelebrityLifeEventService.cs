namespace DAL_Celebrity;

public interface ICelebrityLifeEventService<out TCelebrity, TLifeEvent>
{
    List<TLifeEvent> GetLifeEventsByCelebrityId(int celebrityId);
    TCelebrity? GetCelebrityByLifeEventId(int lifeEventId);
}