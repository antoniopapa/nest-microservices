import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        }
      },
      defaults: {
        from: "no-reply@example.com"
      }
    })
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {
}
