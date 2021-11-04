import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { KafkaError } from "./kafka-error";
import { Repository } from "typeorm";

@Injectable()
export class KafkaService {
  constructor(
    @InjectRepository(KafkaError) private readonly kafkaRepository: Repository<KafkaError>,
    @Inject("KAFKA_SERVICE") private client: ClientKafka
  ) {
  }

  async emit(topic: string[], key: string, value: any) {
    for (let i = 0; i < topic.length; i++) {
      await this.client.emit(topic, {
        key,
        value: JSON.stringify(value)
      });
    }
  }

  async save(data: any) {
    return this.kafkaRepository.save(data);
  }
}
