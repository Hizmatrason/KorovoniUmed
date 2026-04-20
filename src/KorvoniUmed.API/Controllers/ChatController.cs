using KorvoniUmed.API.DTOs;
using KorvoniUmed.Domain.Entities;
using KorvoniUmed.Domain.Enums;
using KorvoniUmed.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KorvoniUmed.API.Controllers;

[ApiController]
[Route("api/admin/chat")]
[Authorize(Roles = "Admin,Operator")]
public class AdminChatController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminChatController(AppDbContext db) => _db = db;

    [HttpGet("sessions")]
    public async Task<ActionResult<List<ChatSessionDto>>> GetSessions([FromQuery] bool activeOnly = true)
    {
        var query = _db.ChatSessions.AsQueryable();
        if (activeOnly)
            query = query.Where(s => s.IsActive);

        var sessions = await query
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new ChatSessionDto
            {
                Id = s.Id,
                VisitorName = s.VisitorName,
                Source = (int)s.Source,
                AssignedOperatorId = s.AssignedOperatorId,
                IsActive = s.IsActive,
                CreatedAt = s.CreatedAt,
                UnreadCount = s.Messages.Count(m => !m.IsFromOperator),
                LastMessage = s.Messages
                    .OrderByDescending(m => m.SentAt)
                    .Select(m => new ChatMessageDto
                    {
                        Id = m.Id,
                        ChatSessionId = m.ChatSessionId,
                        SenderName = m.SenderName,
                        IsFromOperator = m.IsFromOperator,
                        Content = m.Content,
                        SentAt = m.SentAt
                    }).FirstOrDefault()
            }).ToListAsync();

        return Ok(sessions);
    }

    [HttpGet("sessions/{id}/messages")]
    public async Task<ActionResult<List<ChatMessageDto>>> GetMessages(int id)
    {
        var messages = await _db.ChatMessages
            .Where(m => m.ChatSessionId == id)
            .OrderBy(m => m.SentAt)
            .Select(m => new ChatMessageDto
            {
                Id = m.Id,
                ChatSessionId = m.ChatSessionId,
                SenderName = m.SenderName,
                IsFromOperator = m.IsFromOperator,
                Content = m.Content,
                SentAt = m.SentAt
            }).ToListAsync();

        return Ok(messages);
    }

    [HttpPost("sessions/{id}/close")]
    public async Task<ActionResult> CloseSession(int id)
    {
        var session = await _db.ChatSessions.FindAsync(id);
        if (session == null) return NotFound();
        session.IsActive = false;
        session.ClosedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

// Public endpoint for visitors to fetch their own session messages
[ApiController]
[Route("api/chat")]
public class PublicChatController : ControllerBase
{
    private readonly AppDbContext _db;

    public PublicChatController(AppDbContext db) => _db = db;

    [HttpGet("sessions/{id}/messages")]
    public async Task<ActionResult<List<ChatMessageDto>>> GetMessages(int id)
    {
        var session = await _db.ChatSessions.FindAsync(id);
        if (session == null) return NotFound();

        var messages = await _db.ChatMessages
            .Where(m => m.ChatSessionId == id)
            .OrderBy(m => m.SentAt)
            .Select(m => new ChatMessageDto
            {
                Id = m.Id,
                ChatSessionId = m.ChatSessionId,
                SenderName = m.SenderName,
                IsFromOperator = m.IsFromOperator,
                Content = m.Content,
                SentAt = m.SentAt
            }).ToListAsync();

        return Ok(messages);
    }
}
