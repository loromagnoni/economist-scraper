import AuthResult from "../../model/auth-result";
import User from "../../model/user";
import AuthService from "../auth-service-interface";
import jwt from "jwt-simple";
import Config from "../../config/config"

export default class AuthServiceCached implements AuthService {


    getToken(user: User): string {
        return jwt.encode(user, Config.auth_secret);
    }
    
    verifyToken(token: string): User | null {
        try{
            return jwt.decode(token, Config.auth_secret);
        } catch (e) {
            return null;
        }
    }

    cache =  {};

    async logIn(user: User): Promise<AuthResult> {
            if(this.cache[user.username]==null) return AuthResult.NOT_FOUND;
            if(this.cache[user.username]!=user.password) return AuthResult.WRONG_PASSWORD;
            return AuthResult.SUCCESS;
    }

    async signUp(user: User): Promise<AuthResult> {
            if(this.cache[user.username]!=null) return AuthResult.ALREADY_SIGN_UP;
            this.cache[user.username] = user.password;
            return AuthResult.SUCCESS;
    }
    
}