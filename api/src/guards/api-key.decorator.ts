import { SetMetadata } from '@nestjs/common'

export const API_KEY_REQUIRED = 'API_KEY_REQUIRED'

export const ApiKey = () => SetMetadata(API_KEY_REQUIRED, true)