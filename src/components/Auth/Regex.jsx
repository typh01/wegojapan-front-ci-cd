// src/components/Member/SignUp/Regex.js
export const idRegex = /^[a-zA-Z0-9]{6,20}$/;
export const pwRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;
export const nameRegex = /^[가-힣a-zA-Z]{2,10}$/;
export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const verifyCodeRegex = /^\d{4,6}$/;
