namespace KorvoniUmed.Domain.Entities;

public class SiteContent
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string ValueRu { get; set; } = string.Empty;
    public string ValueTj { get; set; } = string.Empty;
    public string ValueEn { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
