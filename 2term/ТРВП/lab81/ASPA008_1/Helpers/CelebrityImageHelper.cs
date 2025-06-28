using System.Text;
using DAL_Celebrity.Entity;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ASPA008_1.Helpers;

public static class CelebrityImageHelper
{
    public static IHtmlContent ZoomableImage(this IHtmlHelper htmlHelper, Celebrity celebrity,
        string cssClass = "celebrity-image")
    {
        var sb = new StringBuilder();

        var imageId = $"celeb-img-{celebrity.Id}";
        sb.Append(GenerateImageMarkup(imageId, celebrity.ReqPhotoPath, celebrity.FullName, cssClass));

        if (!htmlHelper.ViewContext.HttpContext.Items.ContainsKey("ImageModalCreated"))
        {
            sb.Append(GenerateModalMarkup());
            htmlHelper.ViewContext.HttpContext.Items["ImageModalCreated"] = true;
        }

        return new HtmlString(sb.ToString());
    }

    private static string GenerateImageMarkup(string imageId, string imagePath, string alt, string cssClass)
    {
        return $"<img id=\"{imageId}\" src=\"/Photos/{imagePath}\" " +
               $"alt=\"{alt}\" class=\"{cssClass} zoomable-image\" " +
               $"onclick=\"showImageModal('{imageId}')\" />";
    }

    private static string GenerateModalMarkup()
    {
        var sb = new StringBuilder();

        // Modal HTML structure
        sb.AppendLine("<div id=\"imageModal\" class=\"image-modal\">");
        sb.AppendLine("  <span class=\"image-modal-close\" onclick=\"hideImageModal()\">&times;</span>");
        sb.AppendLine("  <img id=\"modalImage\" class=\"image-modal-content\">");
        sb.AppendLine("  <div id=\"imageModalCaption\"></div>");
        sb.AppendLine("</div>");

        // CSS styles
        sb.Append(GenerateModalStyles());

        // JavaScript functions
        sb.Append(GenerateModalScripts());

        return sb.ToString();
    }

    private static string GenerateModalStyles()
    {
        var sb = new StringBuilder();

        sb.AppendLine("<style>");
        sb.AppendLine("  .zoomable-image { cursor: zoom-in; }");
        sb.AppendLine("  .image-modal {");
        sb.AppendLine("    display: none;");
        sb.AppendLine("    position: fixed;");
        sb.AppendLine("    z-index: 1000;");
        sb.AppendLine("    left: 0;");
        sb.AppendLine("    top: 0;");
        sb.AppendLine("    width: 100%;");
        sb.AppendLine("    height: 100%;");
        sb.AppendLine("    overflow: auto;");
        sb.AppendLine("    background-color: rgba(0,0,0,0.9);");
        sb.AppendLine("    padding-top: 60px;");
        sb.AppendLine("  }");
        sb.AppendLine("  .image-modal-content {");
        sb.AppendLine("    margin: auto;");
        sb.AppendLine("    display: block;");
        sb.AppendLine("    max-width: 80%;");
        sb.AppendLine("    max-height: 80%;");
        sb.AppendLine("  }");
        sb.AppendLine("  #imageModalCaption {");
        sb.AppendLine("    margin: auto;");
        sb.AppendLine("    display: block;");
        sb.AppendLine("    width: 80%;");
        sb.AppendLine("    max-width: 700px;");
        sb.AppendLine("    text-align: center;");
        sb.AppendLine("    color: #ccc;");
        sb.AppendLine("    padding: 10px 0;");
        sb.AppendLine("  }");
        sb.AppendLine("  .image-modal-close {");
        sb.AppendLine("    position: absolute;");
        sb.AppendLine("    top: 15px;");
        sb.AppendLine("    right: 35px;");
        sb.AppendLine("    color: #f1f1f1;");
        sb.AppendLine("    font-size: 40px;");
        sb.AppendLine("    font-weight: bold;");
        sb.AppendLine("    transition: 0.3s;");
        sb.AppendLine("    cursor: pointer;");
        sb.AppendLine("  }");
        sb.AppendLine("  .image-modal-close:hover, .image-modal-close:focus {");
        sb.AppendLine("    color: #bbb;");
        sb.AppendLine("    text-decoration: none;");
        sb.AppendLine("  }");
        sb.AppendLine("</style>");

        return sb.ToString();
    }

    private static string GenerateModalScripts()
    {
        var sb = new StringBuilder();

        sb.AppendLine("<script>");
        sb.AppendLine("  function showImageModal(imgId) {");
        sb.AppendLine("    var modal = document.getElementById('imageModal');");
        sb.AppendLine("    var img = document.getElementById(imgId);");
        sb.AppendLine("    var modalImg = document.getElementById('modalImage');");
        sb.AppendLine("    var captionText = document.getElementById('imageModalCaption');");
        sb.AppendLine("    modal.style.display = 'block';");
        sb.AppendLine("    modalImg.src = img.src;");
        sb.AppendLine("    captionText.innerHTML = img.alt;");
        sb.AppendLine("  }");
        sb.AppendLine("  function hideImageModal() {");
        sb.AppendLine("    var modal = document.getElementById('imageModal');");
        sb.AppendLine("    modal.style.display = 'none';");
        sb.AppendLine("  }");
        sb.AppendLine("</script>");

        return sb.ToString();
    }
}