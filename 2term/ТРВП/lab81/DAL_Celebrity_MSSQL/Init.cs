using DAL_Celebrity.Entity;
using Microsoft.EntityFrameworkCore;

namespace DAL_Celebrity_MSSQL;

public class Init
{
    private static string connstring =
        @"Data source=127.0.0.1; Initial Catalog=LES;TrustServerCertificate=True;User Id=SA;Password=Contraseña12345678";

    public Init()
    {
    }

    public Init(string conn)
    {
        connstring = conn;
    }

    public static void Execute(bool delete = true, bool create = true)
    {
        var optionsBuilder = new DbContextOptionsBuilder<CelebrityDbContext>();
        optionsBuilder.UseSqlServer(connstring);
        var context = new CelebrityDbContext(optionsBuilder.Options);

        if (delete) context.Database.EnsureDeleted(); // если есть БД, то она удаляется
        if (create) context.Database.EnsureCreated(); // если нет БД, то создается

        Func<string, string> puri = f => $"{f}";
        {
            //1
            var c = new Celebrity
                { FullName = "Noam Chomsky", Nationality = "US", ReqPhotoPath = puri("Chomsky.jpg") };
            var l1 = new LifeEvent
            {
                CelebrityId = 1, Date = new DateTime(1928, 12, 7), Description = "Дата рождения", ReqPhotoPath = ""
            };
            var l2 = new LifeEvent
            {
                CelebrityId = 1, Date = new DateTime(1955, 1, 1),
                Description = "Издание книги \"Логическая структура лингвистической теории\"", ReqPhotoPath = ""
            };
            context.Celebrities.Add(c);
            context.LifeEvents.Add(l1);
            context.LifeEvents.Add(l2);
        }
        {
            //2
            var c = new Celebrity
                { FullName = "Tim Berners-Lee", Nationality = "UK", ReqPhotoPath = puri("Berners-Lee.jpg") };
            var l1 = new LifeEvent
            {
                CelebrityId = 2, Date = new DateTime(1955, 6, 8), Description = "Дата рождения", ReqPhotoPath = ""
            };
            var l2 = new LifeEvent
            {
                CelebrityId = 2, Date = new DateTime(1989, 6, 8),
                Description = "В CERN предложил \"Гиппертекстовый проект\"", ReqPhotoPath = ""
            };
            context.Celebrities.Add(c);
            context.LifeEvents.Add(l1);
            context.LifeEvents.Add(l2);
        }
        {
            //3
            var c = new Celebrity
                { FullName = "Edgar Codd", Nationality = "US", ReqPhotoPath = puri("Codd.jpg") };
            var l1 = new LifeEvent
            {
                CelebrityId = 3, Date = new DateTime(1923, 8, 23), Description = "Дата рождения", ReqPhotoPath = ""
            };
            var l2 = new LifeEvent
                { CelebrityId = 3, Date = new DateTime(2003, 4, 18), Description = "Дата смерти", ReqPhotoPath = "" };
            context.Celebrities.Add(c);
            context.LifeEvents.Add(l1);
            context.LifeEvents.Add(l2);
        }
        {
            //4
            var c = new Celebrity
                { FullName = "Donald Knuth", Nationality = "US", ReqPhotoPath = puri("Knuth.jpg") };
            var l1 = new LifeEvent
            {
                CelebrityId = 4, Date = new DateTime(1938, 1, 10), Description = "Дата рождения", ReqPhotoPath = ""
            };
            var l2 = new LifeEvent
            {
                CelebrityId = 4, Date = new DateTime(1974, 1, 1), Description = "Премия Тьюринга", ReqPhotoPath = ""
            };
            context.Celebrities.Add(c);
            context.LifeEvents.Add(l1);
            context.LifeEvents.Add(l2);
        }
        {
            //5
            var c = new Celebrity
                { FullName = "Linus Torvalds", Nationality = "US", ReqPhotoPath = puri("Linus.jpg") };
            var l1 = new LifeEvent
            {
                CelebrityId = 5, Date = new DateTime(1969, 12, 28),
                Description = "Дата рождения. Финляндия.", ReqPhotoPath = ""
            };
            var l2 = new LifeEvent
            {
                CelebrityId = 5, Date = new DateTime(1991, 9, 17),
                Description = "Выложил исходный код  OS Linus (версии 0.01)", ReqPhotoPath = ""
            };
            context.Celebrities.Add(c);
            context.LifeEvents.Add(l1);
            context.LifeEvents.Add(l2);
        }
        {
            //6
            var c = new Celebrity
                { FullName = "John Neumann", Nationality = "US", ReqPhotoPath = puri("Neumann.jpg") };
            var l1 = new LifeEvent
            {
                CelebrityId = 6, Date = new DateTime(1903, 12, 28),
                Description = "Дата рождения. Венгрия", ReqPhotoPath = ""
            };
            var l2 = new LifeEvent
                { CelebrityId = 6, Date = new DateTime(1957, 2, 8), Description = "Дата смерти", ReqPhotoPath = "" };
            context.Celebrities.Add(c);
            context.LifeEvents.Add(l1);
            context.LifeEvents.Add(l2);
        }
        {
            //7
            var c = new Celebrity
                { FullName = "Edsger Dijkstra", Nationality = "NL", ReqPhotoPath = puri("Dijkstra.jpg") };
            var l1 = new LifeEvent
            {
                CelebrityId = 7, Date = new DateTime(1930, 12, 28), Description = "Дата рождения", ReqPhotoPath = ""
            };
            var l2 = new LifeEvent
                { CelebrityId = 7, Date = new DateTime(2002, 8, 6), Description = "Дата смерти", ReqPhotoPath = "" };
            context.Celebrities.Add(c);
            context.LifeEvents.Add(l1);
            context.LifeEvents.Add(l2);
        }
        {
            //8
            var c = new Celebrity
                { FullName = "Ada Lovelace", Nationality = "UK", ReqPhotoPath = puri("Lovelace.jpg") };
            var l1 = new LifeEvent
            {
                CelebrityId = 8, Date = new DateTime(1852, 11, 27), Description = "Дата рождения", ReqPhotoPath = ""
            };
            var l2 = new LifeEvent
            {
                CelebrityId = 8, Date = new DateTime(1815, 12, 10), Description = "Дата смерти", ReqPhotoPath = ""
            };
            context.Celebrities.Add(c);
            context.LifeEvents.Add(l1);
            context.LifeEvents.Add(l2);
        }
        {
            //9
            var c = new Celebrity
                { FullName = "Charles Babbage", Nationality = "UK", ReqPhotoPath = puri("Babbage.jpg") };
            var l1 = new LifeEvent
            {
                CelebrityId = 9, Date = new DateTime(1791, 12, 26), Description = "Дата рождения", ReqPhotoPath = ""
            };
            var l2 = new LifeEvent
            {
                CelebrityId = 9, Date = new DateTime(1871, 10, 18), Description = "Дата смерти", ReqPhotoPath = ""
            };
            context.Celebrities.Add(c);
            context.LifeEvents.Add(l1);
            context.LifeEvents.Add(l2);
        }
        {
            //10
            var c = new Celebrity
                { FullName = "Andrew Tanenbaum", Nationality = "NL", ReqPhotoPath = puri("Tanenbaum.jpg") };
            var l1 = new LifeEvent
            {
                CelebrityId = 10, Date = new DateTime(1944, 3, 16), Description = "Дата рождения", ReqPhotoPath = ""
            };
            var l2 = new LifeEvent
            {
                CelebrityId = 10, Date = new DateTime(1987, 1, 1),
                Description = "Cоздал OS MINIX — бесплатную Unix-подобную систему", ReqPhotoPath = ""
            };
            context.Celebrities.Add(c);
            context.LifeEvents.Add(l1);
            context.LifeEvents.Add(l2);
        }
        context.SaveChanges();
    }
}