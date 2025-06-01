using Newtonsoft.Json;
using System;

namespace Message_app.Data.Models
{
    public partial class Message
    {

        public long MessageId { get; set; }
        [JsonProperty("sender_Id")]

        public long SenderId { get; set; }
        [JsonProperty("receiver_Id")]

        public long ReceiverId { get; set; }
        [JsonProperty("message")]
        public string Content { get; set; } = null!;
        [JsonProperty("date_message")]

        public DateTime DateMessage { get; set; }
    }
}
