import { OtherAsset } from "../../../generated/prisma/client"
import { EOtherAssetType, OtherAssetView } from "../dto/other-assets.view"

export function prismaOtherAssetToOtherAssetView(otherAsset: OtherAsset): OtherAssetView {
  return new OtherAssetView({
    id: otherAsset.id,
    userId: otherAsset.userId,
    description: otherAsset.description,
    agency: otherAsset.agency,
    note: otherAsset.note,
    value: Number(otherAsset.value),
    type: otherAsset.type as EOtherAssetType,
    createdAt: otherAsset.createdAt,
    updatedAt: otherAsset.updatedAt,
  })
}
