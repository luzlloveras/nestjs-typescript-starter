import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UseGuards,
  Header,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppService } from './app.service';
import { firstValueFrom } from 'rxjs';
import packageJson from '../package.json';

interface User {
  id: number;
  name: string;
  surname: string;
  age: number;
}

interface CreateUserDto {
  name: string;
  surname: string;
  age: number;
}

@ApiTags('System')
@Controller()
@UseGuards(ThrottlerGuard)
export class AppController {
  private users: User[] = [];
  private counter = 0;
  private readonly serviceName = packageJson.name;
  private readonly version = packageJson.version;

  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  @ApiOperation({ summary: 'API Console landing page' })
  @ApiOkResponse({
    description: 'HTML landing page for the API console.',
    schema: {
      type: 'string',
      example: '<!doctype html><html><body>API Console</body></html>',
    },
  })
  getConsole(): string {
    const environment = process.env.NODE_ENV || 'development';
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${this.serviceName} API Console</title>
    <style>
      :root {
        color-scheme: light;
      }
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        margin: 32px;
        color: #111827;
        background: #ffffff;
      }
      main {
        max-width: 720px;
      }
      h1 {
        font-size: 24px;
        margin-bottom: 8px;
      }
      .meta {
        font-size: 14px;
        color: #4b5563;
        margin-bottom: 24px;
      }
      .section {
        margin-bottom: 24px;
      }
      .links a {
        display: inline-block;
        margin-right: 16px;
        color: #2563eb;
        text-decoration: none;
      }
      .links a:hover {
        text-decoration: underline;
      }
      pre {
        background: #f3f4f6;
        padding: 12px;
        border-radius: 8px;
        overflow-x: auto;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>API Console</h1>
      <div class="meta">
        <div>Service: ${this.serviceName}</div>
        <div>Version: ${this.version}</div>
        <div>Environment: ${environment}</div>
      </div>
      <div class="section links">
        <a href="/api/docs">Swagger UI</a>
        <a href="/redoc">Redoc</a>
        <a href="/openapi.json">OpenAPI JSON</a>
        <a href="/health">Health</a>
      </div>
      <div class="section">
        <strong>Quick examples</strong>
        <pre>curl -X GET http://localhost:3000/api/products</pre>
        <pre>curl -X POST http://localhost:3000/api/products \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Sample product", "price": 49.9, "currency": "USD", "categories": ["category"], "measurements": { "height": 10, "width": 5, "weight": 1 } }'</pre>
      </div>
    </main>
  </body>
</html>`;
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({
    description: 'Service health snapshot.',
    schema: {
      example: { status: 'ok', version: packageJson.version, uptime: 120 },
    },
  })
  getHealth(): { status: string; version: string; uptime: number } {
    return {
      status: 'ok',
      version: this.version,
      uptime: Math.round(process.uptime()),
    };
  }

  @Get('users')
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({
    description: 'Returns all users.',
    schema: {
      example: [{ id: 1, name: 'Jane', surname: 'Doe', age: 28 }],
    },
  })
  getUsers(): User[] {
    return this.users;
  }

  @Get('users/qty')
  @ApiOperation({ summary: 'Get users count' })
  @ApiOkResponse({
    description: 'Returns the number of users.',
    schema: {
      example: { count: 1 },
    },
  })
  getUsersQty(): { count: number } {
    return { count: this.users.length };
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiOkResponse({
    description: 'Returns a single user.',
    schema: {
      example: { id: 1, name: 'Jane', surname: 'Doe', age: 28 },
    },
  })
  getUsersById(@Param('id') id: string): User {
    const user = this.users.find((u) => u.id === parseInt(id, 10));
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({
    schema: {
      example: { name: 'Jane', surname: 'Doe', age: 28 },
    },
  })
  @ApiCreatedResponse({
    description: 'User created.',
  })
  createUser(@Body() userData: CreateUserDto): User {
    this.counter++;
    const newUser: User = {
      id: this.counter,
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  @Get('pokemon')
  @ApiOperation({ summary: 'Fetch a Pokemon from the public API' })
  @ApiOkResponse({
    description: 'Returns data from the public Pokemon API.',
    schema: {
      example: { id: 132, name: 'ditto' },
    },
  })
  async getPokemon(): Promise<any> {
    const response = await this.appService.getPokemonByName('ditto');
    const { data } = await firstValueFrom(response);
    return data;
  }
}


