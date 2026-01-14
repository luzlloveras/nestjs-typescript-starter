import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Welcome to the NestJS starter API.';
  }

  getPokemonByName(name: string) {
    return this.httpService.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }
}
