import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CaptableService } from '../services/captable.service';
import { CaptableResponse } from '../responses/captable.response';

@Controller('captable/')
export class CaptableController {
  constructor(private readonly captableService: CaptableService) {}

  @Post('validate')
  async validateCaptable(@Body() captable: any[]): Promise<any> {
    try {
      return await this.captableService.get(captable);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
