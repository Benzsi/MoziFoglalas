import { Controller, Get, Post, Render, Body, BadRequestException, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

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

    // Save data to CSV file
    this.saveToCSV(formData);

    // Redirect to success page
    return { 
      redirect: '/success',
      formData: formData
    };
  }

  @Get('success')
  @Render('success')
  getSuccess() {
    // This will be called after redirect, but we need the form data
    // We'll handle this differently
    return {};
  }

  private saveToCSV(formData: FormData) {
    const csvFilePath = path.join(process.cwd(), 'foglalasok.csv');
    const csvRow = `${formData.nev},${formData.email},${formData.datum},${formData.fo}\n`;
    
    // Check if file exists, if not create with header
    if (!fs.existsSync(csvFilePath)) {
      const header = 'Név,Email,Dátum,Létszám\n';
      fs.writeFileSync(csvFilePath, header);
    }
    
    // Append the new row
    fs.appendFileSync(csvFilePath, csvRow);
  }
}
