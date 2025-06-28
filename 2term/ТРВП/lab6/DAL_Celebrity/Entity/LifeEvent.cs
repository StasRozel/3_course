namespace DAL_Celebrity.Entity;

public class LifeEvent //  Событие в  жизни знаменитости 
{
    public LifeEvent()
    {
        Description = string.Empty;
    }

    public int Id { get; set; } // Id События  
    public int CelebrityId { get; set; } // Id Знаменитости
    public DateTime? Date { get; set; } // дата События 
    public string Description { get; set; } // описание События 
    public string? ReqPhotoPath { get; set; } // request path  Фотографии

    public virtual bool
        Update(LifeEvent lifeEvent) // -- вспомогательный метод                                           
    {
        if (!(lifeEvent.CelebrityId <= 0)) CelebrityId = lifeEvent.CelebrityId;
        if (!lifeEvent.Date.Equals(new DateTime())) Date = lifeEvent.Date;
        if (!string.IsNullOrEmpty(lifeEvent.Description)) Description = lifeEvent.Description;
        if (!string.IsNullOrEmpty(lifeEvent.ReqPhotoPath)) ReqPhotoPath = lifeEvent.ReqPhotoPath;

        return true;
    }
}