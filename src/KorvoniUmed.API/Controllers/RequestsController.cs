using KorvoniUmed.API.DTOs;
using KorvoniUmed.Domain.Entities;
using KorvoniUmed.Domain.Enums;
using KorvoniUmed.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KorvoniUmed.API.Controllers;

[ApiController]
[Route("api/requests")]
public class RequestsController : ControllerBase
{
    private readonly AppDbContext _db;

    public RequestsController(AppDbContext db) => _db = db;

    [HttpPost]
    public async Task<ActionResult> Create(CreateHelpRequestDto dto)
    {
        var request = new HelpRequest
        {
            Name = dto.Name,
            Phone = dto.Phone,
            Email = dto.Email,
            Message = dto.Message
        };
        _db.HelpRequests.Add(request);
        await _db.SaveChangesAsync();
        return Ok(new { id = request.Id });
    }
}

[ApiController]
[Route("api/admin/requests")]
[Authorize(Roles = "Admin,Operator")]
public class AdminRequestsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminRequestsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<PagedResult<HelpRequestDto>>> GetAll(
        [FromQuery] int? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _db.HelpRequests.AsQueryable();
        if (status.HasValue)
            query = query.Where(r => r.Status == (RequestStatus)status.Value);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new HelpRequestDto
            {
                Id = r.Id,
                Name = r.Name,
                Phone = r.Phone,
                Email = r.Email,
                Message = r.Message,
                Status = (int)r.Status,
                StatusName = r.Status.ToString(),
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt,
                AssignedToUserId = r.AssignedToUserId,
                AdminNotes = r.AdminNotes
            }).ToListAsync();

        return Ok(new PagedResult<HelpRequestDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HelpRequestDto>> GetById(int id)
    {
        var r = await _db.HelpRequests.FindAsync(id);
        if (r == null) return NotFound();
        return Ok(new HelpRequestDto
        {
            Id = r.Id, Name = r.Name, Phone = r.Phone, Email = r.Email,
            Message = r.Message, Status = (int)r.Status, StatusName = r.Status.ToString(),
            CreatedAt = r.CreatedAt, UpdatedAt = r.UpdatedAt,
            AssignedToUserId = r.AssignedToUserId, AdminNotes = r.AdminNotes
        });
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult> UpdateStatus(int id, UpdateRequestStatusDto dto)
    {
        var request = await _db.HelpRequests.FindAsync(id);
        if (request == null) return NotFound();

        request.Status = (RequestStatus)dto.Status;
        request.AdminNotes = dto.AdminNotes;
        request.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
