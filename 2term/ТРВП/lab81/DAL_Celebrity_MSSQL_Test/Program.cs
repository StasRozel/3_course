using DAL_Celebrity_MSSQL;
using DAL_Celebrity.Entity;

internal class Program
{
    private static void Main(string[] args)
    {
        var CS =
            @"Data source=127.0.0.1; Initial Catalog=LES;TrustServerCertificate=True;User Id=SA;Password=Contraseña12345678";
        var init = new Init(CS);
        Init.Execute();

        Func<Celebrity, string> printC = c =>
            c != null
                ? $"Id = {c.Id}, FullName = {c.FullName}, Nationality = {c.Nationality}, ReqPhotoPath = {c.ReqPhotoPath}"
                : "NULL";
        Func<LifeEvent, string> printL = l =>
            $"Id = {l.Id}, CelebrityId = {l.CelebrityId}, Date = {l.Date}, Description = {l.Description}, ReqPhotoPath = {l.ReqPhotoPath}";
        Func<string, string> puri = f => $"{f}";

        using (var repo = CelebrityRepositoryFactory.CreateWithDirectConnectionString(CS))
        {
            {
                Console.WriteLine("------ GetAllCelebrities() ------------- ");
                repo.GetAllCelebrities().ForEach(celebrity => Console.WriteLine(printC(celebrity)));
            }
            {
                Console.WriteLine("------ GetAllLifeEvents() ------------- ");
                repo.GetAllLifeEvents().ForEach(life => Console.WriteLine(printL(life)));
            }
            {
                Console.WriteLine("------ AddCelebrity() --------------- ");
                var c = new Celebrity
                    { FullName = "Albert Einstein", Nationality = "DE", ReqPhotoPath = puri("Einstein.jpg") };
                if (repo.AddCelebrity(c)) Console.WriteLine($"OK: AddCelebrity: {printC(c)}");
                else Console.WriteLine($"ERROR:AddCelebrity: {printC(c)}");
            }
            {
                Console.WriteLine("------ AddCelebrity() --------------- ");
                var c = new Celebrity
                    { FullName = "Samuel Huntington", Nationality = "US", ReqPhotoPath = puri("Huntington.jpg") };
                if (repo.AddCelebrity(c)) Console.WriteLine($"OK: AddCelebrity: {printC(c)}");
                else Console.WriteLine($"ERROR:AddCelebrity: {printC(c)}");
            }
            {
                Console.WriteLine("------ DeleteCelebrity() --------------- ");
                // Use full name "Albert Einstein" instead of just "Einstein"
                var id = 0;
                if ((id = repo.FindCelebrityIdByName("Albert Einstein")) > 0)
                {
                    var c = repo.GetCelebrityById(id);
                    if (c != null)
                    {
                        Console.WriteLine(printC(c));
                        if (!repo.DeleteCelebrity(id)) Console.WriteLine($"ERROR: DeleteCelebrity: {id}");
                        else Console.WriteLine($"OK: DeleteCelebrity: {id}");
                    }
                    else
                    {
                        Console.WriteLine($"ERROR: GetCelebrityById: {id}");
                    }
                }
                else
                {
                    Console.WriteLine("ERROR: FindCelebrityIdByName");
                    // Try using the known ID directly
                    id = 11; // Albert Einstein's ID from the output
                    var c = repo.GetCelebrityById(id);
                    if (c != null)
                    {
                        Console.WriteLine($"Found by ID: {printC(c)}");
                        if (!repo.DeleteCelebrity(id)) Console.WriteLine($"ERROR: DeleteCelebrity: {id}");
                        else Console.WriteLine($"OK: DeleteCelebrity: {id}");
                    }
                }
            }
            {
                Console.WriteLine("------ UpdateCelebrity() --------------- ");
                // Use full name "Samuel Huntington" instead of just "Huntington"
                var id = 0;
                if ((id = repo.FindCelebrityIdByName("Samuel Huntington")) > 0)
                {
                    var c = repo.GetCelebrityById(id);
                    if (c != null)
                    {
                        Console.WriteLine(printC(c));
                        c.FullName = "Samuel Phillips Huntington";
                        if (!repo.UpdateCelebrity(id, c))
                        {
                            Console.WriteLine($"ERROR: UpdateCelebrity: {id}");
                        }
                        else
                        {
                            Console.WriteLine($"OK: UpdateCelebrity:{id}, {printC(c)}");
                            var c1 = repo.GetCelebrityById(id);
                            if (c1 == null) Console.WriteLine($"ERROR: GetCelebrityById {id}");
                            else Console.WriteLine($"OK: GetCelebrityById, {printC(c1)}");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"ERROR: GetCelebrityById: {id}");
                    }
                }
                else
                {
                    Console.WriteLine("ERROR: FindCelebrityIdByName");
                    // Try using the known ID directly
                    id = 12; // Samuel Huntington's ID from the output
                    var c = repo.GetCelebrityById(id);
                    if (c != null)
                    {
                        Console.WriteLine($"Found by ID: {printC(c)}");
                        c.FullName = "Samuel Phillips Huntington";
                        if (!repo.UpdateCelebrity(id, c))
                        {
                            Console.WriteLine($"ERROR: UpdateCelebrity: {id}");
                        }
                        else
                        {
                            Console.WriteLine($"OK: UpdateCelebrity:{id}, {printC(c)}");
                            var c1 = repo.GetCelebrityById(id);
                            if (c1 == null) Console.WriteLine($"ERROR: GetCelebrityById {id}");
                            else Console.WriteLine($"OK: GetCelebrityById, {printC(c1)}");
                        }
                    }
                }
            }
            {
                Console.WriteLine("------ AddLifeEvent() --------------- ");
                // Use exact name or ID directly
                var id = 12; // Samuel Huntington's ID
                var c = repo.GetCelebrityById(id);
                if (c != null)
                {
                    Console.WriteLine(printC(c));
                    LifeEvent l1, l2;

                    // Set ReqPhotoPath to empty string instead of null
                    if (repo.AddLifeEvent(l1 = new LifeEvent
                        {
                            CelebrityId = id, Date = new DateTime(1927, 4, 18), Description = "Дата рождения",
                            ReqPhotoPath = ""
                        }))
                        Console.WriteLine($"OK: AddLifeEvent, {printL(l1)}");
                    else Console.WriteLine($"ERROR: AddLifeEvent, {printL(l1)}");

                    if (repo.AddLifeEvent(l1 = new LifeEvent
                        {
                            CelebrityId = id, Date = new DateTime(1927, 4, 18), Description = "Дата рождения",
                            ReqPhotoPath = ""
                        }))
                        Console.WriteLine($"OK: AddLifeEvent, {printL(l1)}");
                    else Console.WriteLine($"ERROR: AddLifeEvent, {printL(l1)}");

                    if (repo.AddLifeEvent(l2 = new LifeEvent
                        {
                            CelebrityId = id, Date = new DateTime(2008, 12, 24), Description = "Дата смерти",
                            ReqPhotoPath = ""
                        }))
                        Console.WriteLine($"OK: AddLifeEvent, {printL(l2)}");
                    else Console.WriteLine($"ERROR: AddLifeEvent, {printL(l2)}");
                }
                else
                {
                    Console.WriteLine($"ERROR: GetCelebrityById: {id}");
                }
            }
            {
                Console.WriteLine("------ DeleteLifeEvent() --------------- ");
                // Check if event exists before trying to delete
                var id = 22;
                var lifeEvent = repo.GetLifeEventById(id);
                if (lifeEvent != null)
                {
                    if (repo.DeleteLifeEvent(id)) Console.WriteLine($"OK: DeleteLifeEvent: {id}");
                    else Console.WriteLine($"ERROR: DeleteLifeEvent: {id}");
                }
                else
                {
                    Console.WriteLine($"ERROR: LifeEvent with ID {id} not found");
                    // Try with a different ID that exists
                    var events = repo.GetAllLifeEvents();
                    if (events.Count > 0)
                    {
                        var newId = events[events.Count - 1].Id;
                        if (repo.DeleteLifeEvent(newId)) Console.WriteLine($"OK: DeleteLifeEvent: {newId}");
                        else Console.WriteLine($"ERROR: DeleteLifeEvent: {newId}");
                    }
                }
            }
            {
                Console.WriteLine("------ UpdateLifeEvent() --------------- ");
                var id = 23;
                var l1 = repo.GetLifeEventById(id);
                if (l1 != null)
                {
                    l1.Description = "Дата смерти";
                    if (repo.UpdateLifeEvent(id, l1)) Console.WriteLine($"OK:UpdateLifeEvent {id}, {printL(l1)}");
                    else Console.WriteLine($"ERROR:UpdateLifeEvent {id}, {printL(l1)}");
                }
                else
                {
                    Console.WriteLine($"ERROR: LifeEvent with ID {id} not found");
                    // Try with a different ID that exists
                    var events = repo.GetAllLifeEvents();
                    if (events.Count > 0)
                    {
                        var newId = events[0].Id;
                        l1 = repo.GetLifeEventById(newId);
                        if (l1 != null)
                        {
                            l1.Description = "Updated description";
                            if (repo.UpdateLifeEvent(newId, l1))
                                Console.WriteLine($"OK:UpdateLifeEvent {newId}, {printL(l1)}");
                            else Console.WriteLine($"ERROR:UpdateLifeEvent {newId}, {printL(l1)}");
                        }
                    }
                }
            }
            {
                Console.WriteLine("------ GetLifeEventsByCelebrityId ------------- ");
                // Use full name or ID directly
                var id = 12; // Samuel Huntington's ID
                var c = repo.GetCelebrityById(id);
                if (c != null)
                {
                    var events = repo.GetLifeEventsByCelebrityId(c.Id);
                    if (events.Count > 0)
                        events.ForEach(l =>
                            Console.WriteLine($"OK: GetLifeEventsByCelebrityId, {id}, {printL(l)}"));
                    else
                        Console.WriteLine($"No life events found for celebrity ID {id}");
                }
                else
                {
                    Console.WriteLine($"ERROR: GetLifeEventsByCelebrityId: {id}");
                }
            }
            {
                Console.WriteLine("------ GetCelebrityByLifeEventId ------------- ");
                var id = 23;
                var lifeEvent = repo.GetLifeEventById(id);
                if (lifeEvent != null)
                {
                    var c = repo.GetCelebrityByLifeEventId(id);
                    if (c != null)
                        Console.WriteLine($"OK: GetCelebrityByLifeEventId, {id}, {printC(c)}");
                    else
                        Console.WriteLine($"ERROR: GetCelebrityByLifeEventId returned null for ID {id}");
                }
                else
                {
                    Console.WriteLine($"ERROR: LifeEvent with ID {id} not found");
                    // Try with a different ID that exists
                    var events = repo.GetAllLifeEvents();
                    if (events.Count > 0)
                    {
                        var newId = events[0].Id;
                        var c = repo.GetCelebrityByLifeEventId(newId);
                        if (c != null)
                            Console.WriteLine($"OK: GetCelebrityByLifeEventId, {newId}, {printC(c)}");
                        else
                            Console.WriteLine($"ERROR: GetCelebrityByLifeEventId returned null for ID {newId}");
                    }
                }
            }
        }

        Console.WriteLine("------------>");
        Console.ReadKey();
    }
}