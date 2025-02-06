import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    // req.user is added by the JwtAuthGuard
    createPostDto.userId = req.user.id;
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(@Query('limit') limit = 10, @Query('offset') offset: number) {
    const [posts, total] = await this.postsService.findAll(limit, offset);

    return {
      posts,
      total,
      limit,
      offset,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.postsService.findByUser(+userId);
  }
}
