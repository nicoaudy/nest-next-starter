import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule, MailModule, AuthModule, UserModule],
  controllers: [],
})
export class AppModule {}
