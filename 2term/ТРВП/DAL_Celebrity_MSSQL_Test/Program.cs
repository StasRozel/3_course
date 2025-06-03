using DAL_Celebrity;
using DAL_Celebrity_MSSQL;
using DAL_Celedrity_MSSQL;

namespace DAL_Celebrity_MSSQL_Test
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            string CS = "Server=localhost;Database=CelebrityDB;Trusted_Connection=True;TrustServerCertificate=True;";

            Init init = new Init(CS);
            Init.Execute(delete: false, create: false);

            Func<Celebrity, string> printC = (c) => $"Id={c.Id}, FullName={c.FullName}, Nationality={c.Nationality}, ReqPhotoPath={c.ReqPhotoPath}";
            Func<Lifeevent, string> printL = (l) => $"Id={l.Id}, CelebrityId={l.CelebrityId}, Date={l.Date}, Description={l.Description}, ReqPhotoPath={l.ReqPhotoPath}";
            Func<string, string> parU = (string s) => $"[{s}]";

            using (IRepository<Celebrity, Lifeevent> repo = CelebrityRepository.Create(CS))
            {
                Console.WriteLine("---- GetAllCelebrities() ----");
                repo.GetAllCelebrities().ForEach(c => Console.WriteLine(printC(c)));

                Console.WriteLine("---- GetAllLifeevents() ----");
                repo.GetAllLifeevents().ForEach(l => Console.WriteLine(printL(l)));

                Celebrity c = new Celebrity { FullName = "Albert Einstein", Nationality = "DE", ReqPhotoPath = parU("Einstein.jpg") };
                if (repo.AddCelebrity(c)) Console.WriteLine($"OK: AddCelebrity({printC(c)})");
                else Console.WriteLine("ERROR: AddCelebrity()");

                c = new Celebrity { FullName = "Samuel Huntington", Nationality = "US", ReqPhotoPath = parU("Huntington.jpg") };
                if (repo.AddCelebrity(c)) Console.WriteLine($"OK: AddCelebrity({printC(c)})");
                else Console.WriteLine("ERROR: AddCelebrity()");

                int Id;
                if ((Id = repo.GetCelebrityIdByName("Einstein")) > 0)
                    Console.WriteLine($"OK: GetCelebrityIdByName({Id})");
                else
                    Console.WriteLine("ERROR: GetCelebrityIdByName()");

                if ((Id = repo.GetCelebrityIdByName("Huntington")) > 0)
                {
                    Celebrity? c1 = repo.GetCelebrityById(Id);
                    if (c1 != null)
                        Console.WriteLine($"OK: GetCelebrityById({Id})");
                    else
                        Console.WriteLine("ERROR: GetCelebrityById()");
                }
                else
                    Console.WriteLine("ERROR: GetCelebrityIdByName()");

                if ((Id = repo.GetCelebrityIdByName("Huntington")) > 0)
                    Console.WriteLine($"OK: GetCelebrityIdByName({Id})");
                else
                    Console.WriteLine("ERROR: GetCelebrityIdByName()");

                Lifeevent l1 = new Lifeevent { CelebrityId = Id, Date = new DateTime(1993, 1, 1), Description = "AHTA cweprn", ReqPhotoPath = parU("1993.jpg") };
                if (repo.AddLifeevent(l1)) Console.WriteLine($"OK: AddLifeevent({printL(l1)})");
                else Console.WriteLine("ERROR: AddLifeevent()");

                if ((Id = repo.GetCelebrityIdByName("Huntington")) > 0)
                {
                    Celebrity? c2 = repo.GetCelebrityById(Id);
                    if (c2 != null)
                    {
                        if (repo.DelCelebrity(Id)) Console.WriteLine($"OK: DelCelebrity({Id})");
                        else Console.WriteLine("ERROR: DelCelebrity()");
                    }
                    else
                        Console.WriteLine("ERROR: GetCelebrityById()");
                }
                else
                    Console.WriteLine("ERROR: GetCelebrityIdByName()");

                int lId = 22;
                if (repo.DelLifeevent(lId)) Console.WriteLine($"OK: DelLifeevent({lId})");
                else Console.WriteLine("ERROR: DelLifeevent()");

                lId = 11;
                if ((l1 = repo.GetLifeevetById(lId)) != null)
                {
                    l1.Description = "AHTA cweprn";
                    if (repo.UpdLifeevent(lId, l1)) Console.WriteLine($"OK: UpdLifeevent({lId}, {printL(l1)})");
                    else Console.WriteLine("ERROR: UpdLifeevent()");
                }
                else
                    Console.WriteLine("ERROR: GetLifeevetById()");

                if ((Id = repo.GetCelebrityIdByName("Huntington")) > 0)
                {
                    Celebrity? c3 = repo.GetCelebrityById(Id);
                    if (c3 != null)
                    {
                        repo.GetLifeeventsByCelebrityId(Id).ForEach(l => Console.WriteLine($"OK: GetLifeeventsByCelebrityId({Id}), {printL(l)}"));
                    }
                    else
                        Console.WriteLine("ERROR: GetCelebrityById()");
                }
                else
                    Console.WriteLine("ERROR: GetLifeeventsByCelebrityId()");

                lId = 22;
                if ((c = repo.GetCelebrityByLifeeventId(lId)) != null)
                    Console.WriteLine($"OK: GetCelebrityByLifeeventId({lId}), {printC(c)}");
                else
                    Console.WriteLine("ERROR: GetCelebrityByLifeeventId()");
            }

            Console.WriteLine("----> ");
            Console.ReadKey();
        }
    }
}
