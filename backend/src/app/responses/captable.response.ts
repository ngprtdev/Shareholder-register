export class CaptableTitle {
  name!: string;
  quantity!: number;
}

export class CaptableResponse {
  contact!: string;

  titles!: CaptableTitle[];

  FDQuantity!: number;

  NFDQuantity!: number;
}
