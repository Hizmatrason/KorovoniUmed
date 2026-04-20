using KorvoniUmed.API.DTOs;
using KorvoniUmed.API.Hubs;
using KorvoniUmed.Domain.Entities;
using KorvoniUmed.Domain.Enums;
using KorvoniUmed.Infrastructure.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;

namespace KorvoniUmed.API.Services;

public class TelegramBotOptions
{
    public string BotToken { get; set; } = string.Empty;
    public string WebhookUrl { get; set; } = string.Empty;
}

public class TelegramBotService : IHostedService
{
    private readonly IServiceProvider _services;
    private readonly TelegramBotOptions _options;
    private TelegramBotClient? _bot;

    public TelegramBotService(IServiceProvider services, IOptions<TelegramBotOptions> options)
    {
        _services = services;
        _options = options.Value;
    }

    public async Task StartAsync(CancellationToken ct)
    {
        if (string.IsNullOrEmpty(_options.BotToken)) return;

        _bot = new TelegramBotClient(_options.BotToken);

        if (!string.IsNullOrEmpty(_options.WebhookUrl))
        {
            await _bot.SetWebhook($"{_options.WebhookUrl}/api/telegram/webhook", cancellationToken: ct);
        }
    }

    public async Task StopAsync(CancellationToken ct)
    {
        if (_bot != null)
            await _bot.DeleteWebhook(cancellationToken: ct);
    }

    public async Task SendMessageToTelegram(string chatId, string text)
    {
        if (_bot == null) return;
        await _bot.SendMessage(chatId, text);
    }
}

// Controller to handle Telegram webhook callbacks
[Microsoft.AspNetCore.Mvc.ApiController]
[Microsoft.AspNetCore.Mvc.Route("api/telegram")]
public class TelegramController : Microsoft.AspNetCore.Mvc.ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IHubContext<ChatHub> _hub;

    public TelegramController(AppDbContext db, IHubContext<ChatHub> hub)
    {
        _db = db;
        _hub = hub;
    }

    [Microsoft.AspNetCore.Mvc.HttpPost("webhook")]
    public async Task<Microsoft.AspNetCore.Mvc.ActionResult> Webhook([Microsoft.AspNetCore.Mvc.FromBody] Update update)
    {
        if (update.Message?.Text == null) return Ok();

        var telegramChatId = update.Message.Chat.Id.ToString();
        var senderName = update.Message.From?.FirstName ?? "Telegram User";

        var session = await _db.ChatSessions
            .FirstOrDefaultAsync(s => s.TelegramChatId == telegramChatId && s.IsActive);

        if (session == null)
        {
            session = new ChatSession
            {
                VisitorName = senderName,
                Source = ChatSource.Telegram,
                TelegramChatId = telegramChatId
            };
            _db.ChatSessions.Add(session);
            await _db.SaveChangesAsync();
        }

        var message = new Domain.Entities.ChatMessage
        {
            ChatSessionId = session.Id,
            SenderName = senderName,
            IsFromOperator = false,
            Content = update.Message.Text
        };
        _db.ChatMessages.Add(message);
        await _db.SaveChangesAsync();

        var messageDto = new ChatMessageDto
        {
            Id = message.Id,
            ChatSessionId = session.Id,
            SenderName = senderName,
            IsFromOperator = false,
            Content = message.Content,
            SentAt = message.SentAt
        };

        await _hub.Clients.Group("operators").SendAsync("NewMessage", messageDto);
        await _hub.Clients.Group("operators").SendAsync("SessionUpdated", session.Id);

        return Ok();
    }
}
