using System.Text.Json;

namespace ANC25_WEBAPI_DLL;

public class CountryCodesProvider
{
    private readonly List<CountryCode> _countryCodes;

    public CountryCodesProvider(string filePath)
    {
        _countryCodes = LoadCountryCodesFromFile(filePath);
    }

    public string? GetCountryLabelByCode(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new ArgumentException("Code cannot be null or empty", nameof(code));

        var country = _countryCodes.FirstOrDefault(c => c.code.Equals(code, StringComparison.OrdinalIgnoreCase));
        return country?.countryLabel;
    }

    public string? GetCodeByCountryLabel(string countryLabel)
    {
        if (string.IsNullOrWhiteSpace(countryLabel))
            throw new ArgumentException("Country label cannot be null or empty", nameof(countryLabel));

        var country =
            _countryCodes.FirstOrDefault(c => c.countryLabel.Equals(countryLabel, StringComparison.OrdinalIgnoreCase));
        return country?.code;
    }

    public IEnumerable<CountryCode> GetAllCountryCodes()
    {
        return _countryCodes.ToList();
    }

    private List<CountryCode> LoadCountryCodesFromFile(string filePath)
    {
        try
        {
            var jsonString = File.ReadAllText(filePath);
            return JsonSerializer.Deserialize<List<CountryCode>>(jsonString) ?? new List<CountryCode>();
        }
        catch (Exception)
        {
            return [];
        }
    }
}