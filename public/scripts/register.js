// https://jsbin.com/malopev/edit?html,js,output https://www.kurmis.com/2019/11/01/password-strength-javascript.html

function passwordStrength(pw) {
    return /.{8,}/.test(pw) * (  /* at least 8 characters */
        // /.{12,}/.test(pw)          /* bonus if longer */
        + /[a-z]/.test(pw)         /* a lower letter */
        + /[A-Z]/.test(pw)         /* a upper letter */
        + /\d/.test(pw)            /* a digit */
        + /[^A-Za-z0-9]/.test(pw)  /* a special character */
    )
};

const pwInput = document.querySelector(".pwd")

pwInput.addEventListener('keyup', function () {
    document.getElementById("strength").value = passwordStrength(pwInput.value);
    // WE WROTE THIS SECTION. IT TOGGLES THE DISABLED ATTRIBUTE FOR THE REGISTER BUTTON. THIS CAN EASILY BE BYPASSED BY MANUALLY EDITING HTML.
    if (passwordStrength(pwInput.value) >= 4) {
        document.querySelector(".register").removeAttribute("disabled");
    } else {
        document.querySelector(".register").setAttribute("disabled", true);
    }
});
