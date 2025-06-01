# #!/bin/sh

# Wait for Kafka to be ready
while ! nc -z kafka 9092; do
  echo "Waiting for Kafka to be ready..."
  sleep 1
done

# # Create the topic
kafka-topics --bootstrap-server kafka:9092 \
  --create --topic receivedMessages \
  --partitions 1 --replication-factor 1

kafka-topics --bootstrap-server kafka:9092 \
  --create --topic WelcomeEmail \
  --partitions 1 --replication-factor 1

echo "Topic 'receivedMessages' created successfully"  


