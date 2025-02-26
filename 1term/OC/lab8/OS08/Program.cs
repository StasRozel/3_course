using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static void Main(string[] args)
    {
        List<YesRicoCabum> BUMBUMs = new List<YesRicoCabum>();

        while (true)
        {
            YesRicoCabum BUMBUM = new YesRicoCabum();
            BUMBUMs.Add(BUMBUM);

            Task.Run(() => BUMBUM.Cabum());

            long memoryUsed = GC.GetTotalMemory(true);
            Console.WriteLine("Используется памяти: {0} MB", (memoryUsed / (1024 * 1024)));

            Thread.Sleep(1000);
        }
    }
}

class YesRicoCabum
{
    public Int32[] IntArray;

    public YesRicoCabum()
    {
        IntArray = new int[128 * 1024 * 1024 / sizeof(int)];
    }

    public void Cabum()
    {
        Random rand = new Random();
        for (int i = 0; i < IntArray.Length; i++)
        {
            IntArray[i] = rand.Next();
        }
    }
}