export interface Account {
    accountID: string;
    userName: string;
    passWord: string;
    role: number; 
    token: string;// 1 for user, 2 for admin

}