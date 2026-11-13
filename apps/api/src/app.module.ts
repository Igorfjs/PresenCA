import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { PeopleModule } from './modules/people/people.module';
import { EventsModule } from './modules/events/events.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { OrganizersModule } from './modules/organizers/organizers.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
        API_PORT: Joi.number().port().default(4000),
        WEB_ORIGIN: Joi.string().uri().required(),
        DATABASE_URL: Joi.string().required(),
        SESSION_SECRET: Joi.string().min(32).required(),
      }),
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    WorkspacesModule,
    PeopleModule,
    EventsModule,
    AttendanceModule,
    OrganizersModule,
    ReportsModule,
    SettingsModule,
    AuditModule,
  ],
})
export class AppModule {}
