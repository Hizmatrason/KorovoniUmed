using KorvoniUmed.API.DTOs;
using KorvoniUmed.Domain.Entities;
using KorvoniUmed.Domain.Enums;
using KorvoniUmed.Infrastructure.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace KorvoniUmed.API.Hubs;

public class ChatHub : Hub
{
    private readonly AppDbContext _db;

    public ChatHub(AppDbContext db) => _db = db;

    // Visitor sends a message from website
    public async Task SendMessage(SendChatMessageDto dto)
    {
        ChatSession session;
        bool isNew = false;

        if (dto.SessionId.HasValue)
        {
            session = await _db.ChatSessions.FindAsync(dto.SessionId.Value)
                ?? throw new HubException("Session not found");
        }
        else
        {
            session = new ChatSession
            {
                VisitorName = dto.SenderName,
                Source = ChatSource.Website
            };
            _db.ChatSessions.Add(session);
            await _db.SaveChangesAsync();
            isNew = true;

            // Auto-join the caller to the new session group
            await Groups.AddToGroupAsync(Context.ConnectionId, $"session_{session.Id}");

            // Tell the caller their session ID so they can persist it
            await Clients.Caller.SendAsync("SessionCreated", session.Id);
        }

        var message = new ChatMessage
        {
            ChatSessionId = session.Id,
            SenderName = dto.SenderName,
            IsFromOperator = false,
            Content = dto.Content
        };
        _db.ChatMessages.Add(message);
        await _db.SaveChangesAsync();

        var messageDto = new ChatMessageDto
        {
            Id = message.Id,
            ChatSessionId = session.Id,
            SenderName = message.SenderName,
            IsFromOperator = false,
            Content = message.Content,
            SentAt = message.SentAt
        };

        // Notify the visitor (their connection group)
        await Clients.Caller.SendAsync("ReceiveMessage", messageDto);

        // Notify all operators
        await Clients.Group("operators").SendAsync("NewMessage", messageDto);
        await Clients.Group("operators").SendAsync("SessionUpdated", session.Id);
    }

    // Operator sends reply to a session
    public async Task SendOperatorMessage(int sessionId, string content, string operatorName)
    {
        var session = await _db.ChatSessions.FindAsync(sessionId)
            ?? throw new HubException("Session not found");

        var message = new ChatMessage
        {
            ChatSessionId = sessionId,
            SenderName = operatorName,
            IsFromOperator = true,
            Content = content
        };
        _db.ChatMessages.Add(message);
        await _db.SaveChangesAsync();

        var messageDto = new ChatMessageDto
        {
            Id = message.Id,
            ChatSessionId = sessionId,
            SenderName = operatorName,
            IsFromOperator = true,
            Content = content,
            SentAt = message.SentAt
        };

        // Notify the visitor's session group
        await Clients.Group($"session_{sessionId}").SendAsync("ReceiveMessage", messageDto);

        // Notify all operators
        await Clients.Group("operators").SendAsync("NewMessage", messageDto);
    }

    // Visitor joins their session group
    public async Task JoinSession(int sessionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"session_{sessionId}");
    }

    // Operator joins the operators group
    public async Task JoinOperators()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "operators");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
}
