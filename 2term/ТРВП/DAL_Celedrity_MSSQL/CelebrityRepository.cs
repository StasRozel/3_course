using DAL_Celebrity;
using Microsoft.EntityFrameworkCore;

namespace DAL_Celedrity_MSSQL
{


    public class CelebrityRepository : IRepository<Celebrity, Lifeevent>
    {
       
        private bool _disposed = false;
        private string connectionString = "Server=localhost;Database=CelebrityDB;Trusted_Connection=True;TrustServerCertificate=True;";
        private readonly CelebrityContext _context = new CelebrityContext("Server=localhost;Database=CelebrityDB;Trusted_Connection=True;TrustServerCertificate=True;");
        public CelebrityRepository(string connectionString)
        {
            this.connectionString = connectionString;
        }

        public CelebrityRepository(CelebrityContext context)
        {
            _context = context;
        }

        // IMix implementation
        public List<Lifeevent> GetLifeeventsByCelebrityId(int celebrityId)
        {
            return _context.Lifeevents
                .Where(l => l.CelebrityId == celebrityId)
                .ToList();
        }

        public Celebrity? GetCelebrityByLifeeventId(int lifeeventId)
        {
            return _context.Lifeevents
                .Include(l => l.Celebrity)
                .Where(l => l.Id == lifeeventId)
                .Select(l => l.Celebrity)
                .FirstOrDefault();
        }

        public static IRepository<Celebrity, Lifeevent> Create(string connectionString) { return new CelebrityRepository(connectionString); }
        

        // ICelebrity implementation
        public List<Celebrity> GetAllCelebrities()
        {
            return _context.Celebrities.ToList();
        }

        public Celebrity? GetCelebrityById(int id)
        {
            return _context.Celebrities.Find(id);
        }

        public bool DelCelebrity(int id)
        {
            var celebrity = _context.Celebrities.Find(id);
            if (celebrity == null)
                return false;

            _context.Celebrities.Remove(celebrity);
            return _context.SaveChanges() > 0;
        }

        public bool AddCelebrity(Celebrity celebrity)
        {
            _context.Celebrities.Add(celebrity);
            return _context.SaveChanges() > 0;
        }

        public bool UpdCelebrity(int id, Celebrity celebrity)
        {
            var existing = _context.Celebrities.Find(id);
            if (existing == null)
                return false;

            // Используем метод Update из сущности
            if (!existing.Update(celebrity))
                return false;

            existing.Id = id; // Убеждаемся, что Id не изменился
            _context.Entry(existing).State = EntityState.Modified;
            return _context.SaveChanges() > 0;
        }

        public int GetCelebrityIdByName(string name)
        {
            return _context.Celebrities
                .Where(c => c.FullName.Contains(name))
                .Select(c => c.Id)
                .FirstOrDefault();
        }

        // ILifeevent implementation
        public List<Lifeevent> GetAllLifeevents()
        {
            return _context.Lifeevents.ToList();
        }

        public Lifeevent? GetLifeevetById(int id)
        {
            return _context.Lifeevents.Find(id);
        }

        public bool DelLifeevent(int id)
        {
            var lifeevent = _context.Lifeevents.Find(id);
            if (lifeevent == null)
                return false;

            _context.Lifeevents.Remove(lifeevent);
            return _context.SaveChanges() > 0;
        }

        public bool AddLifeevent(Lifeevent lifeevent)
        {
            _context.Lifeevents.Add(lifeevent);
            return _context.SaveChanges() > 0;
        }

        public bool UpdLifeevent(int id, Lifeevent lifeevent)
        {
            var existing = _context.Lifeevents.Find(id);
            if (existing == null)
                return false;

            // Используем метод Update из сущности
            if (!existing.Update(lifeevent))
                return false;

            existing.Id = id; // Убеждаемся, что Id не изменился
            _context.Entry(existing).State = EntityState.Modified;
            return _context.SaveChanges() > 0;
        }

        // IDisposable implementation
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
                _disposed = true;
            }
        }
    }
}
