export interface ProductCard {
  title: string; // 對應後端productName
  type: string[];
  condition: string;
  price: number;
  time: string; // 後端沒有這個欄位
  imgUrl: string; // 對應後端 imgPath ( 好像是
  location: string;
  user: {
    userName: string;
    userImg: string;
    university: string;
    department: string;
    location: string[];
  };
}
