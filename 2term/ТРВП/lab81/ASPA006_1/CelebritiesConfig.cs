namespace ASPA006_1;

public class CelebritiesConfig
{
    public CelebritiesConfig()
    {
    }

    public CelebritiesConfig(string photoPathFolder, string connectionString)
    {
        PhotoPathFolder = photoPathFolder;
        ConnectionString = connectionString;
    }

    public string PhotoPathFolder { get; set; } = string.Empty;
    public string ConnectionString { get; set; } = string.Empty;
}