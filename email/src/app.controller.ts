import { Controller, Get } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { KafkaMessage } from "kafkajs";

@Controller()
export class AppController {
  constructor(
    private mailerService: MailerService
  ) {
  }

  @MessagePattern("email_topic")
  async orderCompleted(@Payload() message: KafkaMessage) {
    console.log(message);
    const order: any = message.value;

    await this.mailerService.sendMail({
      to: "admin@admin.com",
      subject: "An order has been completed",
      html: `Order #${order.id} with a total of $${order.total} has been completed!`
    });

    await this.mailerService.sendMail({
      to: order.ambassador_email,
      subject: "An order has been completed",
      html: `You earned $${order.ambassador_revenue} from the link #${order.code}`
    });
  }
}
