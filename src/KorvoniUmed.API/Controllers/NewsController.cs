using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using KorvoniUmed.API.DTOs;
using KorvoniUmed.Domain.Entities;
using KorvoniUmed.Domain.Enums;
using KorvoniUmed.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KorvoniUmed.API.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly AppDbContext _db;

    public NewsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<PagedResult<NewsListDto>>> GetPublished(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 12)
    {
        var query = _db.News.Where(n => n.Status == NewsStatus.Published);
        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(n => n.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(n => new NewsListDto
            {
                Id = n.Id, TitleRu = n.TitleRu, TitleTj = n.TitleTj, TitleEn = n.TitleEn,
                SummaryRu = n.SummaryRu, SummaryTj = n.SummaryTj, SummaryEn = n.SummaryEn,
                ImageUrl = n.ImageUrl, Slug = n.Slug, PublishedAt = n.PublishedAt
            }).ToListAsync();

        return Ok(new PagedResult<NewsListDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize });
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<NewsDto>> GetBySlug(string slug)
    {
        var n = await _db.News.FirstOrDefaultAsync(x => x.Slug == slug && x.Status == NewsStatus.Published);
        if (n == null) return NotFound();
        return Ok(new NewsDto
        {
            Id = n.Id, TitleRu = n.TitleRu, TitleTj = n.TitleTj, TitleEn = n.TitleEn,
            ContentRu = n.ContentRu, ContentTj = n.ContentTj, ContentEn = n.ContentEn,
            SummaryRu = n.SummaryRu, SummaryTj = n.SummaryTj, SummaryEn = n.SummaryEn,
            ImageUrl = n.ImageUrl, Slug = n.Slug, Status = (int)n.Status,
            CreatedAt = n.CreatedAt, PublishedAt = n.PublishedAt
        });
    }
}

[ApiController]
[Route("api/admin/news")]
[Authorize(Roles = "Admin,ContentManager")]
public class AdminNewsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminNewsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<PagedResult<NewsDto>>> GetAll(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var total = await _db.News.CountAsync();
        var items = await _db.News
            .OrderByDescending(n => n.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(n => MapToDto(n))
            .ToListAsync();

        return Ok(new PagedResult<NewsDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize });
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<NewsDto>> GetById(int id)
    {
        var n = await _db.News.FindAsync(id);
        if (n == null) return NotFound();
        return Ok(MapToDto(n));
    }

    [HttpPost]
    public async Task<ActionResult<NewsDto>> Create(CreateNewsDto dto)
    {
        var news = new News
        {
            TitleRu = dto.TitleRu, TitleTj = dto.TitleTj, TitleEn = dto.TitleEn,
            ContentRu = dto.ContentRu, ContentTj = dto.ContentTj, ContentEn = dto.ContentEn,
            SummaryRu = dto.SummaryRu, SummaryTj = dto.SummaryTj, SummaryEn = dto.SummaryEn,
            ImageUrl = dto.ImageUrl,
            Slug = GenerateSlug(dto.TitleEn),
            Status = (NewsStatus)dto.Status
        };
        if (news.Status == NewsStatus.Published)
            news.PublishedAt = DateTime.UtcNow;

        _db.News.Add(news);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = news.Id }, MapToDto(news));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateNewsDto dto)
    {
        var news = await _db.News.FindAsync(id);
        if (news == null) return NotFound();

        news.TitleRu = dto.TitleRu; news.TitleTj = dto.TitleTj; news.TitleEn = dto.TitleEn;
        news.ContentRu = dto.ContentRu; news.ContentTj = dto.ContentTj; news.ContentEn = dto.ContentEn;
        news.SummaryRu = dto.SummaryRu; news.SummaryTj = dto.SummaryTj; news.SummaryEn = dto.SummaryEn;
        news.ImageUrl = dto.ImageUrl;

        var newStatus = (NewsStatus)dto.Status;
        if (newStatus == NewsStatus.Published && news.Status != NewsStatus.Published)
            news.PublishedAt = DateTime.UtcNow;
        news.Status = newStatus;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var news = await _db.News.FindAsync(id);
        if (news == null) return NotFound();
        _db.News.Remove(news);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static string GenerateSlug(string title)
    {
        var slug = title.ToLowerInvariant().Trim();
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-");
        slug = Regex.Replace(slug, @"-+", "-");
        slug = slug.Trim('-');
        return $"{slug}-{DateTime.UtcNow:yyyyMMddHHmmss}";
    }

    private static NewsDto MapToDto(News n) => new()
    {
        Id = n.Id, TitleRu = n.TitleRu, TitleTj = n.TitleTj, TitleEn = n.TitleEn,
        ContentRu = n.ContentRu, ContentTj = n.ContentTj, ContentEn = n.ContentEn,
        SummaryRu = n.SummaryRu, SummaryTj = n.SummaryTj, SummaryEn = n.SummaryEn,
        ImageUrl = n.ImageUrl, Slug = n.Slug, Status = (int)n.Status,
        CreatedAt = n.CreatedAt, PublishedAt = n.PublishedAt
    };
}
