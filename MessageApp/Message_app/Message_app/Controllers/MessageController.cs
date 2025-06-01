
using Message_app.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using otherServices.Data_Project.Models;
namespace message_app.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessageController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("all-data")]

        public async Task<List<MessageDTo>> GetConversationAsync()
        {
            var messages = await _context.Messages.ToListAsync();

            return messages.Select(m => new MessageDTo
            {
                Id = m.MessageId,
                SenderId = m.SenderId,
                ReceiverId = m.ReceiverId,
                Content = m.Content,
                Timestamp = m.DateMessage,
                //IsRead = m.IsRead
            }).ToList();
        }

    //     [HttpGet("ping")]
    // public IActionResult CheckHealth()
    // {
    //     return Ok("OK Assem we can do it"); // Returns HTTP 200 with "OK" message
    // }
    }
}
