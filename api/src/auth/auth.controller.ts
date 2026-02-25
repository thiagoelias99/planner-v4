import { Body, Controller, Header, Headers, HttpCode, NotImplementedException, Post, Res } from '@nestjs/common'
import { AllowAnonymous } from "@thallesp/nestjs-better-auth"
import { SignUpInput } from "./dto/signup.input"
import { auth } from "../utils/auth"
import { SignInInput } from "./dto/signin.input"
import { type Response } from "express"

@Controller('auth')
export class AuthController {
  @Post("sign-up")
  @AllowAnonymous()
  async signUp(
    @Body() input: SignUpInput,
    @Res({ passthrough: true }) res: Response
  ) {
    const { headers, response } = await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        email: input.email,
        password: input.password,
        name: input.name
      }
    })

    if (headers) {
      headers.forEach((value, key) => {
        res.setHeader(key, value)
      })
    }

    return response
  }

  @Post("sign-in")
  @HttpCode(200)
  @AllowAnonymous()
  async signIn(
    @Body() input: SignInInput,
    @Res({ passthrough: true }) res: Response
  ) {
    const { headers, response } = await auth.api.signInEmail({
      returnHeaders: true,
      body: {
        email: input.email,
        password: input.password
      }
    })

    if (headers) {
      headers.forEach((value, key) => {
        res.setHeader(key, value)
      })
    }

    return response
  }

  @Post("sign-out")
  @HttpCode(204)
  async signOut(
    @Headers() reqHeaders,
    @Res({ passthrough: true }) res: Response
  ) {
    const { headers, response } = await auth.api.signOut({
      headers: reqHeaders,
      returnHeaders: true,
    })

    if (headers) {
      headers.forEach((value, key) => {
        res.setHeader(key, value)
      })
    }

    return response
  }
}
