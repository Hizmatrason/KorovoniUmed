using System.ComponentModel.DataAnnotations;

namespace KorvoniUmed.API.DTOs;

public class CreateNewsDto
{
    [Required, MaxLength(500)]
    public string TitleRu { get; set; } = string.Empty;
    [MaxLength(500)]
    public string TitleTj { get; set; } = string.Empty;
    [MaxLength(500)]
    public string TitleEn { get; set; } = string.Empty;

    [Required]
    public string ContentRu { get; set; } = string.Empty;
    public string ContentTj { get; set; } = string.Empty;
    public string ContentEn { get; set; } = string.Empty;

    public string? SummaryRu { get; set; }
    public string? SummaryTj { get; set; }
    public string? SummaryEn { get; set; }

    public string? ImageUrl { get; set; }
    public int Status { get; set; }
}

public class UpdateNewsDto : CreateNewsDto
{
}

public class NewsDto
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
    public int Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
}

public class NewsListDto
{
    public int Id { get; set; }
    public string TitleRu { get; set; } = string.Empty;
    public string TitleTj { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string? SummaryRu { get; set; }
    public string? SummaryTj { get; set; }
    public string? SummaryEn { get; set; }
    public string? ImageUrl { get; set; }
    public string Slug { get; set; } = string.Empty;
    public DateTime? PublishedAt { get; set; }
}
