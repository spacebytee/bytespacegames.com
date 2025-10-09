const ROOT = "https://api.bytespacegames.com/api/";

const HYPIXEL = ROOT + "hypixel/";
const SHEEP = HYPIXEL + "sheep/";

const AUTH = ROOT + "auth/";
const PROFILE = ROOT + "profile/";
const SESSION = ROOT + "session/";

export const endpoints = {
    ROOT,

    HYPIXEL,
    SHEEP,
    SHEEPSTATS: SHEEP + "stats",
    SHEEPLEADERBOARD: SHEEP + "leaderboard",

    AUTH,
    REGISTER: AUTH + "register",
    LOGIN: AUTH + "login",
    FINALIZE: AUTH + "finalize",
    LOGOUT: AUTH + "logout",

    PROFILE,
    PROFILECONTENT: PROFILE + "content",
    PROFILEWHOAMI: PROFILE+"whoami",

    SESSION,
    SESSIONCREATE: SESSION + "create",
    SESSIONVALIDATE: SESSION + "validate",
};
