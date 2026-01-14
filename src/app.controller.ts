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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppService } from './app.service';
import { firstValueFrom } from 'rxjs';

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

@ApiTags('app')
@Controller()
@UseGuards(ThrottlerGuard)
export class AppController {
  private users: User[] = [];
  private counter = 0;

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  getUsers(): User[] {
    return this.users;
  }

  @Get('users/qty')
  getUsersQty(): { count: number } {
    return { count: this.users.length };
  }

  @Get('users/:id')
  getUsersById(@Param('id') id: string): User {
    const user = this.users.find((u) => u.id === parseInt(id, 10));
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
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
  async getPokemon(): Promise<any> {
    const response = await this.appService.getPokemonByName('ditto');
    const { data } = await firstValueFrom(response);
    return data;
  }
}


