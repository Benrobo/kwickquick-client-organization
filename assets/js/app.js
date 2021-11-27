
const $ = (elm) => {
    return document.querySelector(elm)
}

const $all = (elm) => {
    return document.querySelectorAll(elm)
}

function getOrgInfo() {
    let item = localStorage.getItem("kwickquick-organization")

    return JSON.parse(item)
}

function Alert() {

    this.success = (text) => {
        return Swal.fire({
            title: 'Success!',
            text: text,
            icon: 'success',
            confirmButtonText: 'Cool'
        })
    }

    this.error = (text) => {
        return Swal.fire({
            title: 'Failure!',
            text: text,
            icon: 'error',
            confirmButtonText: 'Try again later'
        })
    }
}
let alert = new Alert()

async function request(api, data, method, headers) {
    let req = await fetch(api, {
        method,
        headers,
        body: JSON.stringify(data)
    })

    let res = await req.json()
    return { req, res };
}

function redirect(time, path) {
    setTimeout(() => {
        location = path
    }, time);
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};


const saveToLocalStorage = (data) => {
    return localStorage.setItem("kwickquick-organization", JSON.stringify(data))
}
// SIgn up

const SIGNUP = () => {
    let nameInp = $(".org-name")
    let emailInp = $(".org-email")
    let numberInp = $(".org-number")
    let pwdInp = $(".org-pwd")
    let confirmPwd = $(".org-confirm-pwd")
    let submitBtn = $(".submit-btn");
    let loading = false;

    submitBtn.onclick = async (e) => {
        e.preventDefault()

        if (nameInp.value === "" || emailInp.value === "" || numberInp.value === "" || pwdInp.value === "" || confirmPwd.value === "") {
            alert.error("Fields cant be empty")
            return
        }
        else if (!validateEmail(emailInp.value)) {
            alert.error("Email is invalid")
            return
        }
        else if (pwdInp.value !== confirmPwd.value) {
            alert.error("Password must be equal");
            return;
        }
        else {
            try {
                // send form data
                loading = true;
                submitBtn.innerHTML = "Signing up...."
                let data = {
                    orgName: nameInp.value,
                    email: emailInp.value,
                    password: confirmPwd.value,
                    image: "",
                    orNumber: numberInp.value
                }
                let api = "http://localhost:5000/kwickquick/api/register"
                let { req, res } = await request(api, data, "post", {
                    "content-type": "application/json"
                })
                console.log(res)
                if (req.status === 200) {
                    loading = false;
                    submitBtn.innerHTML = "Sign up"
                    alert.success(res.message)
                    return redirect(1000, "/login.html")
                }
                else {
                    loading = false;
                    submitBtn.innerHTML = "Sign up"
                    alert.error(res.message)
                }
            } catch (e) {
                alert.success("Something went wrong, please try later")
            }
        }



    }
}

const LOGIN = () => {
    let emailInp = $(".org-email")
    let pwdInp = $(".org-pwd")
    let submitBtn = $(".submit-btn");
    let loading = false;

    submitBtn.onclick = async (e) => {
        e.preventDefault()



        if (emailInp.value === "" || pwdInp.value === "") {
            alert.error("Fields cant be empty")
            return
        }
        else if (!validateEmail(emailInp.value)) {
            alert.error("Email is invalid")
            return
        }
        else {
            try {
                // send form data
                loading = true;
                submitBtn.innerHTML = "Signing up...."
                let data = {
                    email: emailInp.value,
                    password: pwdInp.value,
                }
                let api = "http://localhost:5000/kwickquick/api/login"

                let { req, res } = await request(api, data, "post", {
                    "content-type": "application/json"
                })

                if (req.status === 200) {
                    loading = false;
                    submitBtn.innerHTML = "Sign up"
                    alert.success(res.message)
                    saveToLocalStorage(res)
                    return redirect(1000, "/Dashboard")
                }
                else {
                    loading = false;
                    submitBtn.innerHTML = "Sign up"
                    alert.error(res.message)
                }
            } catch (e) {
                alert.success("Something went wrong, please try later")
            }
        }



    }
}


// sidebar
const SIDEBAR = () => {
    let burger = $(".navbar-burger");
    let closeBtn = $('.closenavbar');
    let sidebar = $(".sidebar-nav");

    burger.onclick = () => {
        sidebar.style.width = "250px"
    }

    closeBtn.onclick = (e) => {
        sidebar.style.width = "0px"
    }
}
