using KorvoniUmed.API.DTOs;
using KorvoniUmed.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KorvoniUmed.API.Controllers;

[ApiController]
[Route("api/content")]
public class ContentController : ControllerBase
{
    private readonly AppDbContext _db;

    public ContentController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<SiteContentDto>>> GetAll()
    {
        var items = await _db.SiteContents
            .Select(c => new SiteContentDto
            {
                Id = c.Id, Key = c.Key,
                ValueRu = c.ValueRu, ValueTj = c.ValueTj, ValueEn = c.ValueEn
            }).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{key}")]
    public async Task<ActionResult<SiteContentDto>> GetByKey(string key)
    {
        var c = await _db.SiteContents.FirstOrDefaultAsync(x => x.Key == key);
        if (c == null) return NotFound();
        return Ok(new SiteContentDto { Id = c.Id, Key = c.Key, ValueRu = c.ValueRu, ValueTj = c.ValueTj, ValueEn = c.ValueEn });
    }
}

[ApiController]
[Route("api/admin/content")]
[Authorize(Roles = "Admin,ContentManager")]
public class AdminContentController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminContentController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<SiteContentDto>>> GetAll()
    {
        var items = await _db.SiteContents
            .Select(c => new SiteContentDto
            {
                Id = c.Id, Key = c.Key,
                ValueRu = c.ValueRu, ValueTj = c.ValueTj, ValueEn = c.ValueEn
            }).ToListAsync();
        return Ok(items);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateSiteContentDto dto)
    {
        var content = await _db.SiteContents.FindAsync(id);
        if (content == null) return NotFound();
        content.ValueRu = dto.ValueRu;
        content.ValueTj = dto.ValueTj;
        content.ValueEn = dto.ValueEn;
        content.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
