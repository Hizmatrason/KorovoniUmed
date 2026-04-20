using KorvoniUmed.Domain.Enums;

namespace KorvoniUmed.Domain.Entities;

public class ChatSession
{
    public int Id { get; set; }
    public string VisitorName { get; set; } = string.Empty;
    public ChatSource Source { get; set; } = ChatSource.Website;
    public string? TelegramChatId { get; set; }
    public string? AssignedOperatorId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ClosedAt { get; set; }

    public List<ChatMessage> Messages { get; set; } = new();
}
