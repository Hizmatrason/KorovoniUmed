namespace KorvoniUmed.Domain.Entities;

public class ChatMessage
{
    public int Id { get; set; }
    public int ChatSessionId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public bool IsFromOperator { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public ChatSession ChatSession { get; set; } = null!;
}
