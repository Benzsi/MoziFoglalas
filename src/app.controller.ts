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
  async submitForm(@Body() formData: any) {

    if (formData && formData.fo !== undefined) {
      const n = Number(formData.fo);
      formData.fo = isNaN(n) ? undefined : n;
    }

    const errors: string[] = [];

    if (!formData.nev || !String(formData.nev).trim()) {
      errors.push('Név kötelező');
    }

    const emailRegex = /^.+@.+$/;
    if (!formData.email) {
      errors.push('E-mail cím kötelező');
    } else if (!emailRegex.test(formData.email)) {
      errors.push('Az e-mail cím formátuma nem megfelelő');
    }

    if (!formData.datum) {
      errors.push('Dátum és időpont kötelező');
    } else {
      const selected = new Date(formData.datum);
      const now = new Date();
      if (isNaN(selected.getTime())) {
        errors.push('A megadott dátum/idő formátuma nem megfelelő');
      } else if (selected < now) {
        errors.push('A dátum/időpont nem lehet régebbi az aktuálisnál');
      }
    }

    if (formData.fo === undefined || formData.fo === null) {
      errors.push('Létszám kötelező');
    } else if (Number(formData.fo) < 1 || Number(formData.fo) > 10) {
      errors.push('A létszám 1 és 10 között kell legyen');
    }

    if (errors.length > 0) {
      return {
        message: this.appService.getHello(),
        errors: errors,
        old: formData,
      };
    }

    try {
      await this.appService.saveBooking(formData);
    } catch (err) {
      return {
        message: this.appService.getHello(),
        errors: [typeof err === 'string' ? err : 'Nem sikerült menteni a foglalást'],
        old: formData,
      };
    }

    return {
      message: 'Sikeres foglalás!',
      formData: formData,
    };
  }
}
