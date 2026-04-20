using System.ComponentModel.DataAnnotations;

namespace KorvoniUmed.API.DTOs;

public class CreateHelpRequestDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, Phone, MaxLength(50)]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress, MaxLength(200)]
    public string? Email { get; set; }

    [Required, MaxLength(2000)]
    public string Message { get; set; } = string.Empty;
}

public class UpdateRequestStatusDto
{
    [Required]
    public int Status { get; set; }
    public string? AdminNotes { get; set; }
}

public class HelpRequestDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string Message { get; set; } = string.Empty;
    public int Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? AssignedToUserId { get; set; }
    public string? AdminNotes { get; set; }
}
