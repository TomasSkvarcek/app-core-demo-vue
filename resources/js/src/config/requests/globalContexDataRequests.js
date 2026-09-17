import {getLoggedInUserSessionData} from "@/src/core/services/userService.js";

function getGlobalContextDataRequests(globalContextDataObj, requestAbortControllerSignal) {
    return [
        getLoggedInUserSessionData({ signal: requestAbortControllerSignal })
            .then(data => {
                globalContextDataObj.loggedInUserData = data;
            })
    ];
}

export {
    getGlobalContextDataRequests
}
