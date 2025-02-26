using System.Diagnostics;

class Program
{
    const int ThreadCount = 19;        // В 1.5 раза больше логических процессоров
    const int ThreadLifeTime = 20;     // Время жизни каждого потока
    const int ObservationTime = 45;
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
                lock (matrixLock)
                {
                    Matrix[id, ElapsedSeconds] += 50;
                }
            }
            MySleep(50);
        }
    }
    static void Main(string[] args)
    {
        Console.WriteLine("A student ... is placing threads to the pool...");
        for (int i = 0; i < ThreadCount; ++i)
        {
            object o = i;
            ThreadPool.QueueUserWorkItem(WorkThread, o);
        }
        Console.WriteLine("A student ... is waiting for the threads to finish...");
        Thread.Sleep(1000 * ObservationTime);
        for (int s = 0; s < ObservationTime; s++)
        {
            Console.Write("{0,3}: ", s);
            for (int th = 0; th < ThreadCount; th++)
            {
                Console.Write(" {0,5}", Matrix[th, s]);
            }
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
