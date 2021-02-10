//THIS IS VULNERABLE. CAN REGISTER WITH WEAK PASSWORD BY DELETING THE DISABLED ATTRIBUTE FROM THE REGISTER BUTTON

// https://jsbin.com/malopev/edit?html,js,output https://www.kurmis.com/2019/11/01/password-strength-javascript.html
const pw = document.querySelector(".pwd")

//TEST RETURNS THE VALUE OF 1 IF IT'S TRUE. IF ALL ARE TRUE IT RETURNS 4
function passwordStrength(pwInput) {
    return /.{8,}/.test(pwInput) * (  /* at least 8 characters */
        // /.{12,}/.test(pw)          /* bonus if longer */
        + /[a-z]/.test(pwInput)         /* a lower letter */
        + /[A-Z]/.test(pwInput)         /* a upper letter */
        + /\d/.test(pwInput)            /* a digit */
        + /[^A-Za-z0-9]/.test(pwInput)  /* a special character */
    )
};

// ACCEPTS THE CLASS NAME OF YOUR TARGET AND THE CRITERIA IT MUST MEET. IF CRITERIA IS MET, IT REMOVES THE UNMET CLASS.
function checkPassReq(targClass, criteria) {
    let target = document.querySelector(targClass);
    if(criteria) {
        target.classList.remove("unmet");
    } else if (!target.classList.contains("unmet")) { // IF IT DOESN'T MEET THE CRITERIA AND DOESN'T CONTAIN UNMET, THEN ADD UNMET AGAIN.
        target.classList.add("unmet");
    }
};

// EVENT LISTENER FOR ANYTIME THE A KEY IS LET GO
pw.addEventListener('keyup', function() {
        if (passwordStrength(pw.value) >= 4) {
            document.querySelector(".register").removeAttribute("disabled"); // SINCE WE MET ALL CRITERIA, ENABLE THE REGISTER BUTTON
        } else {
            document.querySelector(".register").setAttribute("disabled", true); // ENSURE THE DISABLED ATTRIBUTE ADDED SINCE WE DIDN'T MEET ALL CRITERIA
        }
        checkPassReq(".length", /.{8,}/.test(pw.value));
        checkPassReq(".lower", /[a-z]/.test(pw.value));
        checkPassReq(".upper", /[A-Z]/.test(pw.value));
        checkPassReq(".number", /\d/.test(pw.value));
        checkPassReq(".special", /[^A-Za-z0-9]/.test(pw.value));
        checkPassReq(".bonus", /.{12,}/.test(pw.value));
})