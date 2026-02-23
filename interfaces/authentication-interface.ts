export interface SignInPayload {
    username: string;
    password: string;
}


export interface SignUpPayload {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
}


export type Severity = "success" | "error" | "warning" | "info";
