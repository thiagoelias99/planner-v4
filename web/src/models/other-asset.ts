
export enum EOtherAssetType {
  CASH_BOX = "CASH_BOX",
  PENSION = "PENSION",
  PROPERTY = "PROPERTY",
  OTHER = "OTHER",
}

export const eOtherAssetTypeMapper: Record<
  EOtherAssetType,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  [EOtherAssetType.CASH_BOX]: { label: "Caixinha", variant: "default" },
  [EOtherAssetType.PENSION]: { label: "Previdência", variant: "secondary" },
  [EOtherAssetType.PROPERTY]: { label: "Imóvel", variant: "outline" },
  [EOtherAssetType.OTHER]: { label: "Outros", variant: "secondary" },
}

export interface IOtherAsset {
  id: string
  userId: string
  description: string
  agency: string | null
  note: string | null
  value: number
  type: EOtherAssetType
  createdAt: string
  updatedAt: string
}

export interface ICreateOtherAsset {
  description: string
  agency?: string
  note?: string
  value: number
  type: EOtherAssetType
}

export interface IUpdateOtherAsset extends Partial<ICreateOtherAsset> {}

export interface IQueryOtherAsset {
  page?: number
  limit?: number
  orderBy?: "createdAt" | "updatedAt" | "value" | "description"
  order?: "asc" | "desc"
  description?: string
  agency?: string
  type?: EOtherAssetType
}
