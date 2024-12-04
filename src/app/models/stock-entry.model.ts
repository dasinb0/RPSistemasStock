  export interface Deposit {
    codigo: string;
    descripcion: string;
  }
  
  export interface StockEntryPayload {
    api_key_rp: string;
    cabecera: {
      codigo_comprobante: string;
      codigo_deposito: string;
    };
    articulos: {
      codigo_articulo: string;
      cantidad: number;
      obser: string;
    }[];
  }