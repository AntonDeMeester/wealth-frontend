import * as JwtInterceptors from "./jwtInterceptor";

export function addInterceptors() {
    JwtInterceptors.addJwtHeaderInterceptor();
    JwtInterceptors.addRefreshJwtInterceptor();
}
