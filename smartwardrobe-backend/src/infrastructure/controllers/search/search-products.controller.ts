import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SearchProductUsecase } from 'src/use-cases/search/search-products.usecase';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadSearchPictureService } from 'src/infrastructure/services/uploadProfilePicture/upload-search-picture';
import { SearchImageSimilarProductReqDto } from 'src/core/dto/search/search-image-similar-products-req-dto';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Controller('search')
@ApiTags('Search')
export class SearchSimilarProductsController {
  constructor(
    private usecase: SearchProductUsecase,
    private uploadSearchPictureService: UploadSearchPictureService,
  ) {}

  @Post('get-all-similar-products-to-image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Search Image picture upload',
    type: SearchImageSimilarProductReqDto,
  })
  async uploadPictureAndFindSimilarProducts(
    @UploadedFile() file: Multer.File,
    @Body() dto: SearchImageSimilarProductReqDto,
  ) {
    const { query } = dto;

    if (file === undefined && query === '') {
      throw new BadRequestException(MESSAGES.SEARCH.NO_FILE_OR_QUERY);
    }

    if (file !== undefined) {
      const fileUrl = await this.uploadSearchPictureService.uploadFile(file);
      return await this.usecase.searchSimilarItemsToImage(fileUrl);
    }

    return {
      data: [],
      message: MESSAGES.PRODUCT.GET.SUCCESS,
    };
  }
}
