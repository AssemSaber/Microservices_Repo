using Confluent.Kafka;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System;
using System.Threading;
using System.Threading.Tasks;
namespace Message_app.Data.Service
{
    public class KafkaBackgroundConsumer : BackgroundService
    {
        private readonly KafkaConsumerService _consumerService;

        public KafkaBackgroundConsumer(KafkaConsumerService consumerService)
        {
            _consumerService = consumerService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await _consumerService.StartConsumerAsync(stoppingToken);
        }

    }
}
