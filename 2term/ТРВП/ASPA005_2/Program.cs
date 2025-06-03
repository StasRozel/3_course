using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseExceptionHandler("/Error");

// Группа A - целочисленные значения
var groupA = app.MapGroup("/A");

// GET /A/x - x ≤ 100
groupA.MapGet("/{x:int:max(100)}", (HttpContext context, [FromRoute] int x) =>
    Results.Ok(new Answer<int> { x = x, message = context.Request.Path.Value }));

// POST /A/x - 0 ≤ x ≤ 100
groupA.MapPost("/{x:int:min(0):max(100)}", (HttpContext context, [FromRoute] int x) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x }));

// PUT /A/x/y - x ≥ 1, y ≥ 1
groupA.MapPut("/{x:int:min(1)}/{y:int:min(1)}", (HttpContext context, [FromRoute] int x, [FromRoute] int y) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x, y = y }));

// DELETE /A/x-y - x ≥ 1, y > 1, y ≤ 100
groupA.MapDelete("/{x:int:min(1)}-{y:int:min(2):max(100)}", (HttpContext context, [FromRoute] int x, [FromRoute] int y) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x, y = y }));

// Группа B - float значения
var groupB = app.MapGroup("/B");

// GET /B/x - x = float-значение
groupB.MapGet("/{x:float}", (HttpContext context, [FromRoute] float x) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x }));

// POST /B/x/y - x = float-значение, y = float-значение
groupB.MapPost("/{x:float}/{y:float}", (HttpContext context, [FromRoute] float x, [FromRoute] float y) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x, y = y }));

// DELETE /B/x-y - x = float-значение, y = float-значение
groupB.MapDelete("/{x:float}-{y:float}", (HttpContext context, [FromRoute] float x, [FromRoute] float y) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x, y = y }));

// Группа C - bool значения
var groupC = app.MapGroup("/C");

// GET /C/x - x = bool-значение
groupC.MapGet("/{x:bool}", (HttpContext context, [FromRoute] bool x) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x }));

// POST /C/x/y - x = bool-значение, y = bool-значение
groupC.MapPost("/{x:bool}/{y:bool}", (HttpContext context, [FromRoute] bool x, [FromRoute] bool y) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x, y = y }));

// Группа D - DateTime значения
var groupD = app.MapGroup("/D");

// GET /D/x - x = DateTime-значение
groupD.MapGet("/{x:datetime}", (HttpContext context, [FromRoute] DateTime x) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x }));

// POST /D/x/y - x = DateTime-значение, y = DateTime-значение
groupD.MapPost("/{x:datetime}/{y:datetime}", (HttpContext context, [FromRoute] DateTime x, [FromRoute] DateTime y) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x, y = y }));

// Группа E - строковые значения
var groupE = app.MapGroup("/E");

// GET /E/x - x = строка, обязательное значение
groupE.MapGet("/{x:required}", (HttpContext context, [FromRoute] string x) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x }));

// PUT /E/x - x = строка, только буквы, 2 ≤ длина ≤ 12
groupE.MapPut("/{x:alpha:length(2,12)}", (HttpContext context, [FromRoute] string x) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x }));

// Группа F - специальные форматы
var groupF = app.MapGroup("/F");

// PUT /F/x - x = строка, формат email, домен=by
groupF.MapPut("/{x:regex(^[\\w-\\.]+@([\\w-]+\\.)+by$)}", (HttpContext context, [FromRoute] string x) =>
    Results.Ok(new { path = context.Request.Path.Value, x = x }));

// Обработка ошибок
app.Map("/Error", (HttpContext ctx) => {
    Exception? ex = ctx.Features.Get<IExceptionHandlerFeature>()?.Error;
    return Results.BadRequest(new { message = ex?.Message });
});

// Обработка несуществующих маршрутов
app.MapFallback((HttpContext ctx) =>
    Results.NotFound(new { message = $"path {ctx.Request.Path.Value} not supported" }));

app.Run();