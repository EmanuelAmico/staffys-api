export interface ResponseBody<Data = null> {
  status: number;
  message: string;
  data: Data;
}
