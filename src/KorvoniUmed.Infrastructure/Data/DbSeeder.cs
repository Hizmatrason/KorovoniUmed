using KorvoniUmed.Domain.Entities;
using KorvoniUmed.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace KorvoniUmed.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var context = services.GetRequiredService<AppDbContext>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        await context.Database.MigrateAsync();

        string[] roles = { "Admin", "Operator", "ContentManager" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        const string adminEmail = "admin@caravanofhope.tj";
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var admin = new AppUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = "Administrator",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(admin, "Admin123!");
            await userManager.AddToRoleAsync(admin, "Admin");
        }

        if (!await context.SiteContents.AnyAsync())
        {
            context.SiteContents.AddRange(
                new SiteContent
                {
                    Key = "hero_title",
                    ValueRu = "Корвони Умед",
                    ValueTj = "Корвони Умед",
                    ValueEn = "Korvoni Umed"
                },
                new SiteContent
                {
                    Key = "hero_subtitle",
                    ValueRu = "Караван надежды - поддержка женщин и детей с 2009 года",
                    ValueTj = "Корвони умед - дастгирии занон ва кудакон аз соли 2009",
                    ValueEn = "Caravan of Hope - supporting women and children since 2009"
                },
                new SiteContent
                {
                    Key = "hero_cta",
                    ValueRu = "Нужна помощь? Оставьте заявку",
                    ValueTj = "Кумак лозим? Дархост гузоред",
                    ValueEn = "Need help? Leave a request"
                },
                new SiteContent
                {
                    Key = "about_short",
                    ValueRu = "Корвони Умед - одна из наиболее активных общественных организаций в Таджикистане, помогающая женщинам и детям, оказавшимся в трудных жизненных ситуациях.",
                    ValueTj = "Корвони Умед - яке аз фаъолтарин созмонхои чамъиятии Точикистон, ки ба занон ва кудакони дар вазъияти душвор кумак мерасонад.",
                    ValueEn = "Korvoni Umed is one of the most active public organizations in Tajikistan, helping women and children in difficult life situations."
                },
                new SiteContent
                {
                    Key = "activity_shelter",
                    ValueRu = "Мы управляем приютом в Душанбе, где женщины и их дети получают безопасное жилье, питание, психологическую и юридическую помощь.",
                    ValueTj = "Мо дар Душанбе паноhгоhе идора мекунем, ки дар он занон ва кудаконашон манзили бехатар, хурок, кумаки равони ва хукуки мегиранд.",
                    ValueEn = "We operate a shelter in Dushanbe where women and their children receive safe housing, meals, psychological and legal support."
                },
                new SiteContent
                {
                    Key = "activity_training",
                    ValueRu = "Учебный центр обучает кройке и шитью, кулинарии, кондитерскому делу и изготовлению бижутерии.",
                    ValueTj = "Маркази таълими мо бурриш ва дузандаги, ошпази, кулинария ва сохтани зеварот меомузонад.",
                    ValueEn = "Our training center teaches sewing, cooking, confectionery and jewelry making."
                },
                new SiteContent
                {
                    Key = "activity_cafe",
                    ValueRu = "Социальное кафе Чатр - уникальный проект, где работают бывшие подопечные. Прибыль идет на содержание приюта.",
                    ValueTj = "Кафеи ичтимоии Чатр - лоихаи беназир, ки дар он собик зери парасторон кор мекунанд. Фоида барои нигохдории паноhгоh сарф мешавад.",
                    ValueEn = "Social cafe Chatr is a unique project where former beneficiaries work. Profits go to maintain the shelter."
                }
            );
            await context.SaveChangesAsync();
        }
    }
}
