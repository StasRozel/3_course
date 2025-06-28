using DAL_Celebrity;
using DAL_Celebrity.Entity;

namespace DAL_Celebrity_MSSQL;

public class CelebrityRepository : IRepository<Celebrity, LifeEvent>
{
    private readonly CelebrityDbContext _context;
    private bool _disposed;

    public CelebrityRepository(CelebrityDbContext context)
    {
        _context = context;
    }

    #region ICelebrityRepository Implementation

    public List<Celebrity> GetAllCelebrities()
    {
        return _context.Celebrities.ToList();
    }

    public Celebrity? GetCelebrityById(int id)
    {
        return _context.Celebrities.FirstOrDefault(c => c.Id == id);
    }

    public bool DeleteCelebrity(int id)
    {
        var celebrity = _context.Celebrities.FirstOrDefault(c => c.Id == id);
        if (celebrity == null) return false;

        _context.Celebrities.Remove(celebrity);
        return _context.SaveChanges() > 0;
    }

    public bool AddCelebrity(Celebrity celebrity)
    {
        _context.Celebrities.Add(celebrity);
        return _context.SaveChanges() > 0;
    }

    public bool UpdateCelebrity(int id, Celebrity celebrity)
    {
        var existingCelebrity = _context.Celebrities.FirstOrDefault(c => c.Id == id);
        if (existingCelebrity == null) return false;

        existingCelebrity.Update(celebrity);
        return _context.SaveChanges() > 0;
    }

    public int FindCelebrityIdByName(string name)
    {
        var celebrity = _context.Celebrities.FirstOrDefault(c => c.FullName == name);
        return celebrity?.Id ?? -1;
    }

    #endregion

    #region ILifeEventRepository Implementation

    public List<LifeEvent> GetAllLifeEvents()
    {
        return _context.LifeEvents.ToList();
    }

    public LifeEvent? GetLifeEventById(int id)
    {
        return _context.LifeEvents.FirstOrDefault(e => e.Id == id);
    }

    public bool DeleteLifeEvent(int id)
    {
        var lifeEvent = _context.LifeEvents.FirstOrDefault(e => e.Id == id);
        if (lifeEvent == null) return false;

        _context.LifeEvents.Remove(lifeEvent);
        return _context.SaveChanges() > 0;
    }

    public bool AddLifeEvent(LifeEvent lifeEvent)
    {
        _context.LifeEvents.Add(lifeEvent);
        return _context.SaveChanges() > 0;
    }

    public bool UpdateLifeEvent(int id, LifeEvent lifeEvent)
    {
        var existingLifeEvent = _context.LifeEvents.FirstOrDefault(e => e.Id == id);
        if (existingLifeEvent == null) return false;

        existingLifeEvent.Update(lifeEvent);
        return true;
    }

    #endregion

    #region ICelebrityLifeEventService Implementation

    public List<LifeEvent> GetLifeEventsByCelebrityId(int celebrityId)
    {
        return _context.LifeEvents.Where(e => e.CelebrityId == celebrityId).ToList();
    }

    public Celebrity? GetCelebrityByLifeEventId(int lifeEventId)
    {
        var lifeEvent = _context.LifeEvents.FirstOrDefault(e => e.Id == lifeEventId);
        if (lifeEvent == null) return null;

        return _context.Celebrities.FirstOrDefault(c => c.Id == lifeEvent.CelebrityId);
    }

    #endregion

    #region IDisposable Implementation

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing) _context.Dispose();
            _disposed = true;
        }
    }

    #endregion
}