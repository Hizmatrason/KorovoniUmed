namespace KorvoniUmed.API.DTOs;

public class ChatMessageDto
{
    public int Id { get; set; }
    public int ChatSessionId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public bool IsFromOperator { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
}

public class ChatSessionDto
{
    public int Id { get; set; }
    public string VisitorName { get; set; } = string.Empty;
    public int Source { get; set; }
    public string? AssignedOperatorId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int UnreadCount { get; set; }
    public ChatMessageDto? LastMessage { get; set; }
}

public class SendChatMessageDto
{
    public string Content { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public int? SessionId { get; set; }
}

public class SiteContentDto
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string ValueRu { get; set; } = string.Empty;
    public string ValueTj { get; set; } = string.Empty;
    public string ValueEn { get; set; } = string.Empty;
}

public class UpdateSiteContentDto
{
    public string ValueRu { get; set; } = string.Empty;
    public string ValueTj { get; set; } = string.Empty;
    public string ValueEn { get; set; } = string.Empty;
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
