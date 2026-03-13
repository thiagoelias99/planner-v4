export enum EPages {
  HOME = '/',
  TERMS_OF_SERVICE = '/termos-de-servico',
  PRIVACY_POLICY = '/politica-de-privacidade',

  // Auth Pages
  SIGN_IN = '/app/entrar',
  SIGN_UP = '/app/registro',
  FORGOT_PASSWORD = '/app/recuperar-senha',
  RESET_PASSWORD = '/app/redefinir-senha',

  // Protected Pages
  DASHBOARD = '/app/dashboard',
  USER_ACCOUNT = '/app/conta',
  ORDERS = '/app/ordens',
  FIXED_INCOMES = '/app/renda-fixa',
  OTHER_ASSETS = '/app/admin/outros-ativos',
  ASSET_BALANCE = '/app/balanco-de-ativos',

  // Admin Pages
  USERS = '/app/admin/usuarios',
  TICKERS = '/app/admin/tickers',
}