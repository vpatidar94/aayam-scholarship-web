// It's Global constant file
// use "UPPER_SNAKE_CASE" to define
export const CONSTANTS = Object.freeze({
  WHATSAPP_URL: 'https://crmapi.wa0.in/whatsapp/waba/v1/messages',
  API: {
    QUESTIONS: "/GetQuestionsByTestId",
    // LOGIN: "/auth/login",
    LOGIN_SIGNUP: "/users/addUpdateUser",
    UPDATE_NAME: "/users/updateName",
    SUBMIT_SCORE: "/test/addScore",
    SUBMIT_RESULT: "/test/submitResult",
    GET_TEST: '/test/getTest',
    GET_TEST_DETAIL: '/test/getTestDetail',
    GET_DASHBOARD_DETAILS: '/result/getResultDashboard',
    GET_ALL_SCORE_POINTS: '/result/getAllScorePoints',
    // GET_ALL_TEST: '/test/getAllTest',
    GET_ALL_TEST: '/test/alltests',
    GET_ALL_MARGDARSHAKS: '/margdarshak/getAllMargdarshaks',
    GET_ALL_SAKSHAM_SCHOOLS: '/sakshamSchool/getAllSakshamSchools',
    GET_ALL_EMPLOYEES: '/employee/getAllEmployees',
    GENERATE_RANK: '/users/generate-rank',
    SEND_WP_MESSAGES: '/result/sendWpMessage',
    GET_RESULT_BY_TEST: '/users/details',
    ADD_TEST_DETAIL: '/test/addTest',
    ADD_ORGANISATION: '/organisation/addOrganisation',
    GET_ORGANISATIONS: '/organisation/',
    SIGNUP_ORG_USER_DETAIL: '/users/updateOrgAdminDetails',
    // GET_ALL_USERS: '/result/getAllResultsDetails',
    GET_ALL_USERS: '/users/',
    GET_ALL_ENQUIRY_USERS: '/enquiry/all',
    GET_USER_BY_ID: '/users/user',
    SEND_SMS_OTP: '/users/send-signup-otp',
    SEND_LOGIN_OTP: '/users/signin-otp',
    SIGNIN: '/users/signin',
    VERIFY_OTP: '/users/verifyotp',
    UPDATE_REGISTERATION: '/users/signup',
    SINGLE_ENROLL: '/users/generate-enrolNo',
    ADD_ENQUIRY: '/enquiry/add',
    ADD_DOCTOR: '/doctor/add',
    ADD_MARGDARSHAK: '/margdarshak/add',
    ADD_SAKSHAM_SCHOOL: '/sakshamSchool/add',
    ADD_EMPLOYEE: '/employee/add',
    UPDATE_ENQUIRY: '/enquiry/update',
    UPDATE_EMPLOYEE: '/employee/update',

    
  },
  MESSAGES: {
    LOGIN_FAILURE: "Login failed",
    LOGIN_SUCCESS: "Login successful",
    SIGNUP_SUCCESS: "Singup successful",
    OTP_MESSAGE: "Here is you one time OTP: ",
    INVALID_OTP: "You have entered the wrong OTP.",
    OTP_SENT: "OTP has been sent to your Whatsapp no.",
    SMS_OTP_SENT: "OTP has been sent to your Mobile No",
    GENERATED_RANK_SUCCESS: 'Generated rank successfully.',
    ERROR_SENDING_MESSAGE: 'Error in sending otp. Please try again.',
    OTP_VERIFY: 'Otp is successfully verified',
    TEST_CENTER_FULL: 'Chosen test center is full or not found. Select other center or contact on 07314058393',
    USER_EXIST: 'User already exist',
    SOMETHING_WRONG: 'Something went wrong',
    USER_NOT_FOUND: 'User not found. Please register.'

  },
  VALIDATE: {
    PASSWORD_MAX_LENGTH: 8,
  },
  QUESTION_OPTIONS: ["A", "B", "C", "D"]
});

export type ButtonType = 'button' | 'submit';
export type AlertType = 'success' | 'info' | 'danger' | 'warning' | '';
export type ToggleType = 'Yes' | 'No';
export type GenderType = 'Male' | 'Female' | 'Other';
export type ClassType = "9" | "10" | "11-PCM" |"11-PCB" | "12-PCM" | "11-PCB";
export type SubjectGroupType = "PCM" | "PCB";
export type StreamType = 'NEET' | 'JEE';
export type MediumType = 'English' | 'Hindi';
export type ModeType = 'online' | 'offline';
export type ModeIndoreType = 'offline';

export type TestCenterType = "St. Arnold's School (Lalaram Nagar Indore)" | "Annie Besant School (Precanco Colony, Annapurna Road,Indore)" | "Prestige Institute of Engineering(Scheme 74 Vijay nagar, Indore)";
export type OfflineTestDateType = "7 Jan" | "14 Jan";
export type OnlineTestDateType = "7 Jan" | "8 Jan" | "9 jan" | "10 Jan" | "11 jan" | "12 Jan" | "13 jan" | "14 Jan";




export type SubjectNameType = "PHYSICS" | "CHEMISTRY" | "BIOLOGY" | "MATHS" | "SCIENCE" | "SOCIAL-SCIENCE";
export enum UserTypeEnum {
  ADMIN = 'admin',
  ORG_ADMIN = 'org-admin',
  USER = 'user',
  SUB_ADMIN = 'sub-admin'
}