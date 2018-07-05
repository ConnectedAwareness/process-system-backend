import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/*
    Encapsulation of the Swagger Configuration
*/
export class SwaggerConfiguration {
    static configure(app: INestApplication): INestApplication {
        const options = new DocumentBuilder()
            .setTitle('process-system-backend')
            .setDescription('backend service for process system')
            .setVersion('v0.1')
            .addTag('versions', 'Api for versions')
            .addTag('organisation', 'Api for UserManagement')
            .addTag('auth', 'Api for Authentication')
            //.setBasePath('')
            .build();

        const document = SwaggerModule.createDocument(app, options);

        SwaggerModule.setup('/api', app, document);

        console.log("swagger documentation configured unter '/api'");

        return app;
    }
}