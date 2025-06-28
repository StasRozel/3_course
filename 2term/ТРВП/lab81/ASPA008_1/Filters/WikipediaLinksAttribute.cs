using DAL_Celebrity.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ASPA008_1.Filters;

public class WikipediaLinksAttribute : ActionFilterAttribute
{
    public override void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Result is ViewResult viewResult)
            if (viewResult.Model is Celebrity celebrity)
            {
                var nameParts = celebrity.FullName.Split(' ');
                var links = new List<WikipediaLink>();

                links.Add(new WikipediaLink
                {
                    DisplayText = celebrity.FullName,
                    Url = $"https://en.wikipedia.org/wiki/{celebrity.FullName.Replace(" ", "_")}"
                });

                viewResult.ViewData["WikipediaLinks"] = links;
            }

        base.OnActionExecuted(context);
    }
}

public class WikipediaLink
{
    public string DisplayText { get; set; }
    public string Url { get; set; }
}