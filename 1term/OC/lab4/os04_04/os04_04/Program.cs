using System.Diagnostics;

class Program
{
    // Поток Z работает 10 секунд
    static void ThreadZed()
    {
        for (int i = 0; i < 10; i++)
        {
            Console.Write(" (Z-{0}) ", Thread.CurrentThread.ManagedThreadId);
            Thread.Sleep(1000);
        }
        Console.WriteLine("\nПоток Z завершается ");
    }

    // Поток работает 20 секунд, параметр - строка-идентификатор
    static void ThreadWithParam(object o)
    {
        for (int i = 0; i < 20; i++)
        {
            Console.Write(" ({0}-{1}) ", o.ToString(), Thread.CurrentThread.ManagedThreadId);
            Thread.Sleep(1000);
        }
    }

    static void Main(string[] args)
    {
        Stopwatch stopwatch = new Stopwatch(); // Создаем объект Stopwatch
        stopwatch.Start(); // Запускаем таймер

        var t1 = new Thread(ThreadZed);
        var t1a = new Thread(ThreadWithParam);
        var t1b = new Thread(ThreadWithParam);
        t1.IsBackground = true; // false для 11 п.п
        t1a.IsBackground = false;  // false для 12 п.п
        t1b.IsBackground = true;  // Фоновый поток
        t1.Start();
        t1a.Start("Стас"); // Имя
        t1b.Start("Розель"); // Фамилия

        // Главный поток работает 5 секунд
        for (int i = 0; i < 5; i++)
        {
            Console.Write(" (*-{0}) ", Thread.CurrentThread.ManagedThreadId);
            Thread.Sleep(1000);
        }
        Console.WriteLine("\nГлавный поток завершается");

        // Ждем завершения не фонового потока
        t1a.Join();

        stopwatch.Stop(); // Останавливаем таймер
        Console.WriteLine("\nВремя выполнения приложения: {0} секунд", stopwatch.Elapsed.TotalSeconds);
    }
}
