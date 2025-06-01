using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace Message_app.Data.Models
{
    public partial class Email
    {
        [Key]
        public long userId { get; set; }
        public String username { get; set; }    
        public String email { get; set; }    
        public String status { get; set; }    
       

        public DateTime DateMessage { get; set; }
    }
}
