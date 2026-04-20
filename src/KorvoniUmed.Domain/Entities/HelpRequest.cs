using KorvoniUmed.Domain.Enums;

namespace KorvoniUmed.Domain.Entities;

public class HelpRequest
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string Message { get; set; } = string.Empty;
    public RequestStatus Status { get; set; } = RequestStatus.New;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string? AssignedToUserId { get; set; }
    public string? AdminNotes { get; set; }
}
