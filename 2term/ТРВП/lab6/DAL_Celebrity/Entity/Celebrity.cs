namespace DAL_Celebrity.Entity;

public class Celebrity //  Знаменитость  
{
    public Celebrity()
    {
        FullName = string.Empty;
        Nationality = string.Empty;
    }

    public int Id { get; set; } // Id Знаменитости        
    public string FullName { get; set; } // полное имя   Знаменитости
    public string Nationality { get; set; } // гражданство  Знаменитости ( 2 символа ISO )
    public string? ReqPhotoPath { get; set; } // request path  Фотографии   

    public virtual bool Update(Celebrity celebrity) // --вспомогательный метод  
    {
        if (!string.IsNullOrEmpty(celebrity.FullName)) FullName = celebrity.FullName;
        if (!string.IsNullOrEmpty(celebrity.Nationality)) Nationality = celebrity.Nationality;
        if (!string.IsNullOrEmpty(celebrity.ReqPhotoPath)) ReqPhotoPath = celebrity.ReqPhotoPath;
        return true; //  изменения были ?
    }
}