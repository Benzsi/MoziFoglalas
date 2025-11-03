import { Controller, Get, Post, Render, Body, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';

interface FormData {
  nev?: string;
  email?: string;
  datum?: string;
  fo?: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return { message: this.appService.getHello() };
  }

  @Post('submit_form')
  @Render('index')
  submitForm(@Body() formData: FormData) {

    if (!formData.nev) {
      throw new BadRequestException('Név kötelező');
    }

    const emailRegex = /^.+@.+$/;
    
    if (!formData.email) {
      throw new BadRequestException('E-mail cím kötelező');
    }
    
    if (!emailRegex.test(formData.email)) {
      throw new BadRequestException('Az email cim formátuma nem megfelelő.');
    }


    
     if (!formData.datum) {
      throw new BadRequestException('Dátum kötelező');
    }

    const today = new Date().toISOString().split('T')[0];
    
    if (formData.datum < today) {
      throw new BadRequestException('A dátum nem lehet régebbi a mainál');
    }

    

    if (!formData.fo) {
      throw new BadRequestException('Létszám kötelező');
    }

    if (formData.fo < 1 || formData.fo > 10) {
      throw new BadRequestException('A létszám 1 és 10 között kell legyen');
    }

    return { 
      message: 'Sikeres foglalás!',
      formData: formData
    };
  }
}
