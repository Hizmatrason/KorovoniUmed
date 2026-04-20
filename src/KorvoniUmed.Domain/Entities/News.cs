using KorvoniUmed.Domain.Enums;

namespace KorvoniUmed.Domain.Entities;

public class News
{
    public int Id { get; set; }

    public string TitleRu { get; set; } = string.Empty;
    public string TitleTj { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;

    public string ContentRu { get; set; } = string.Empty;
    public string ContentTj { get; set; } = string.Empty;
    public string ContentEn { get; set; } = string.Empty;

    public string? SummaryRu { get; set; }
    public string? SummaryTj { get; set; }
    public string? SummaryEn { get; set; }

    public string? ImageUrl { get; set; }
    public string Slug { get; set; } = string.Empty;
    public NewsStatus Status { get; set; } = NewsStatus.Draft;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PublishedAt { get; set; }
    public string? AuthorId { get; set; }
}
