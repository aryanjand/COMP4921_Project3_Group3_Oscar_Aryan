import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Response as Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Cookies, Public, ReqUser } from '../common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ParseTokenPipe } from 'src/common/pipes';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validates an existing user.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully Validated.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiBody({
    type: SignInDto,
    description: 'User is loaded in Session',
  })
  @Public()
  @Post('signin')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(dto, res);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiBody({
    type: SignUpDto,
    description: 'User is loaded in Session',
  })
  @Public()
  @Post('signup')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('signout')
  @ApiOperation({
    summary: 'Sign Out',
    description:
      'Signs out the user. By destroying Session. and redirect user to root.',
  })
  signOut(
    @Cookies(ParseTokenPipe) token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(token, res);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Profile',
    description: 'Renders the user profile page.',
  })
  @Get('profile')
  profile(@ReqUser() user: unknown) {
    return user;
  }

  @ApiOperation({
    summary: 'Check Authentication',
    description: 'Check if user is authenticated',
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Get('session')
  session(
    @Cookies(ParseTokenPipe) token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.session(token, res);
  }
}
