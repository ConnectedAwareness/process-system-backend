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
            .addTag('organisations', 'Api for organisation management')
            .addTag('users', 'Api for user management')
            .addTag('auth', 'Api for authentication')
            .setBasePath('/')
            .build();

        const document = SwaggerModule.createDocument(app, options);
        const swaggerApiUrl = 'api/swagger';

        SwaggerModule.setup(swaggerApiUrl, app, document);

        console.log(`swagger documentation configured under ${swaggerApiUrl}`);

        return app;
    }
}