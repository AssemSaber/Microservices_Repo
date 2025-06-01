using Confluent.Kafka;
using Message_app.Data.Models;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System;
using System.Threading;
using System.Threading.Tasks;
namespace Message_app.Data.Service
{
    public class KafkaConsumerService : IHostedService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private Task _executingTask;
        private CancellationTokenSource _cts;

        public KafkaConsumerService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            _executingTask = Task.Run(() => StartConsumerAsync(_cts.Token), cancellationToken);
            return Task.CompletedTask;
        }

        public async Task StartConsumerAsync(CancellationToken cancellationToken)
        {
            var config = new ConsumerConfig
            {
                BootstrapServers = "kafka:9092",
                GroupId = "your-group-id",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            using var consumer = new ConsumerBuilder<Ignore, string>(config).Build();
            consumer.Subscribe("WelcomeEmail");

            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    var result = consumer.Consume(cancellationToken);
                    Console.WriteLine($"Received message: {result.Message.Value}");

                    using var scope = _scopeFactory.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    var data = JsonConvert.DeserializeObject<Email>(result.Message.Value);
                    if (data.DateMessage < new DateTime(1753, 1, 1))
                    {
                        data.DateMessage = DateTime.Now; 
                    }
                    db.Email.Add(data);
                    await db.SaveChangesAsync();
                }
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine("Kafka consumer stopped.");
                consumer.Close();
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _cts.Cancel();
            return Task.CompletedTask;
        }
    }
}
