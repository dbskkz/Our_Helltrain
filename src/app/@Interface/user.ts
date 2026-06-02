//送出基本資料
export interface UserReq {
  name: string;
  password: string;
  email: string;
  location: string;
  school: string;
  phone: string | null;
}

//通用的後端回應格式
export interface BasicResponse {
  statusCode: number;
  message: string;
}

//驗證碼
export interface VerifyVO {
  email: number;
  code: string;
}

//修改個人資訊（密碼以外）
export interface SetInfoVo {
  email: string;
  name: string;
  location: string[]; // 如果選方案 A 叫 List；選方案 B 就改成 location: string
  school: string;
  department: string; // 配合 Java 名稱叫 department
  phone: string;
  msg: string;        // 配合 Java 變數名稱：個人簡介（原本叫 profile）
  deleteImg: boolean; // 配合 Java 變數名稱：是否刪除照片
}


//修改密碼
export interface ChangePasswordVo {
  email: string;
  nowPad: string; // 配合 Java 的變數名稱：目前密碼
  newPad: string; // 配合 Java 的變數名稱：新密碼
}

//登入成功專用的回應格式判斷<是管理者或是使用者>
export interface LogInRes extends BasicResponse {
  role: string;  // 用來判斷是 'User' 還是 'Manager'
  data: any;     // 對應 Java 的 Object，可以裝使用者或管理員的整包帳號資料
}


