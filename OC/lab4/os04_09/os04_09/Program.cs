using System;
using System.Diagnostics;
using System.Threading.Tasks;

class Program
{
    const int ThreadCount = 20;
    const int ThreadLifeTime = 20; // Время жизни потоков в секундах
    const int ObservationTime = 60; // Общее время наблюдения в секундах
    static int[,] Matrix = new int[ThreadCount, ObservationTime];
    static DateTime StartTime = DateTime.Now;

    private static object matrixLock = new object();

    static void WorkThread(object o)
    {
        int id = (int)o;
        for (int i = 0; i < ThreadLifeTime * 20; i++)
        {
            DateTime CurrentTime = DateTime.Now;
            int ElapsedSeconds = (int)Math.Round(CurrentTime.Subtract(StartTime).TotalSeconds - 0.49);
            if (ElapsedSeconds >= 0 && ElapsedSeconds < ObservationTime)
            {
                    Matrix[id, ElapsedSeconds] += 50;
            }
            MySleep(50);
        }
    }

    static void Main(string[] args)
    {
        Task[] tasks = new Task[ThreadCount]; 
        for (int i = 0; i < ThreadCount; i++)
        {
            int threadId = i; 
            tasks[i] = Task.Run(() => WorkThread(threadId));
        }

        Console.WriteLine("A student ... is waiting for tasks to finish...");
        Task.WaitAll(tasks);

        for (int s = 0; s < ObservationTime; s++)
        {
            Console.Write("{0,3}: ", s);
            for (int th = 0; th < ThreadCount; th++)
                Console.Write(" {0,5}", Matrix[th, s]);
            Console.WriteLine();
        }
    }

    static Double MySleep(int ms)
    {
        Double Sum = 0, Temp;
        Stopwatch stopwatch = Stopwatch.StartNew();

        while (stopwatch.ElapsedMilliseconds < ms)
        {
            Temp = 0.711 + (Double)(stopwatch.ElapsedMilliseconds) / 10000.0;
            Double a, b, c, d, e, nt;
            for (int k = 0; k < 5500; ++k)
            {
                nt = Temp - k / 27000.0;
                a = Math.Sin(nt);
                b = Math.Cos(nt);
                c = Math.Cos(nt / 2.0);
                d = Math.Sin(nt / 2);
                e = Math.Abs(1.0 - a * a - b * b) + Math.Abs(1.0 - c * c - d * d);
                Sum += e;
            }
        }

        return Sum;
    }
}
