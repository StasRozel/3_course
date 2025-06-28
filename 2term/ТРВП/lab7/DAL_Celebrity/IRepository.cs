namespace DAL_Celebrity;

public interface IRepository<TCelebrity, TLifeEvent> :
    ICelebrityRepository<TCelebrity>,
    ILifeEventRepository<TLifeEvent>,
    ICelebrityLifeEventService<TCelebrity, TLifeEvent>
{
}