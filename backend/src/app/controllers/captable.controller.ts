import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CaptableService } from '../services/captable.service';
import { CaptableResponse } from '../responses/captable.response';

@Controller('captable/')
export class CaptableController {
  constructor(private readonly captableService: CaptableService) {}

  @Post('validate')
  async validateCaptable(@Body() captable: any[]): Promise<CaptableResponse[]> {
    try {
      const result = await this.captableService.get(captable);

      if (!Array.isArray(result)) {
        throw new BadRequestException('Invalid response format from service.');
      }

      return result.map((item) => {
        if (
          !item.contact ||
          !item.titles ||
          typeof item.FDQuantity !== 'number' ||
          typeof item.NFDQuantity !== 'number'
        ) {
          throw new BadRequestException('Invalid CaptableResponse structure.');
        }
        return item as CaptableResponse;
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
