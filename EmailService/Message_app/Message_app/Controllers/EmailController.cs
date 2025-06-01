
using Message_app.Data;
using Message_app.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace message_app.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController
    {
        private readonly AppDbContext _context;

        public EmailController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("all-data")]

        public async Task<List<EmailDto>> GetConversationAsync()
        {
            var messages = await _context.Email.ToListAsync();

            return messages.Select(m => new EmailDto
            {
                username=m.username,
                email = m.email,
                status = m.status,
                DateMessage = m.DateMessage,
            }).ToList();
        }

    }
}
