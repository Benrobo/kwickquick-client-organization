const $ = (elm) => {
    return document.querySelector(elm)
}

const $all = (elm) => {
    return document.querySelectorAll(elm)
}

function redirect(time, path) {
    setTimeout(() => {
        location = path
    }, time);
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

// navbar

const NavBarDropDown = () => {
    let dropdowncont = $(".dropdown-content");
    let dropdownicon = $(".dropdown-icon");
    let infoCont = $(".info")
    let logoutbtn = $(".logout-btn")

    let { refreshToken, org } = getOrgInfo()

    dropdownicon.onclick = () => {
        dropdowncont.classList.toggle("active")
    }

    infoCont.innerHTML = `
        <span><b>${org.orgName}</b></span>
        <small>Chief Manager</small>
    `

    logoutbtn.onclick = () => {
        localStorage.removeItem("kwickquick-organization")
        location.reload()
    }
}

const DASHBOARD_MAIN = () => {
    let totalProductPrice = $(".total-product-price")
    let totalProductsScanned = $(".total-product-scanned")
    let totalGoods = $(".total-goods")

    let { refreshToken, org } = getOrgInfo()

    const getProducts = async () => {
        try {
            let api = "http://localhost:5000/kwickquick/api/all/getOrgProducts"
            let { req, res } = await request(api, { orgId: org.id }, "post", {
                "content-type": "application/json",
                "authorization": `  Bearer ${refreshToken}`
            })

            if (req.status === 200) {
                totalGoods.innerHTML = res.length;
            }
        } catch (e) {
            alert.error("Something went wrong fetching details")
        }
    }

    getProducts()
}

// products
const ProductsDetails = () => {
    let detailsBtn = $all(".products-details-btn");
    let productModal = $(".products-info-modal");

    let closeModalBtn = $(".close-products-modal");

    detailsBtn.forEach((btn) => {
        btn.onclick = (e) => {
            productModal.style.display = "flex"
        }
    })

    closeModalBtn.onclick = () => {
        productModal.style.display = "none"
    }

}

const createCountryCurrencies = async () => {
    let currencyInp = $(".currencies");
    let req = await fetch("js/currency.json");
    let data = await req.json();

    for (const res in data) {
        let symbol = data[res].symbol;
        let name = data[res].name;

        let options = document.createElement("option");

        options.value = symbol;
        options.textContent = `${name} (${symbol})`;

        currencyInp.append(options)
    }
}


// Add products
const ADD_PRODUCTS = async () => {
    let nameInp = $(".pName")
    let priceInp = $(".pPrice")
    let currencyInp = $(".currencies");
    let uploadBtn = $(".upload")
    let file = $(".imageInp");
    let imgPreview = $(".product-image-preview");
    let submitBtn = $(".submit-btn");
    let base64Image = "";
    let qrcodeBox = $(".qrcode-image");
    let qrcodeBtn = $(".qrcode-icon")
    let loading = false;
    let qrcodeImageModal = $(".qrcode-main-modal")
    let closeQrcodeModal = $(".close-qrcode-modal")

    let { refreshToken, org } = getOrgInfo()


    // close modal
    closeQrcodeModal.onclick = () => {
        qrcodeImageModal.style.visibility = "hidden"
    }

    // fill the select tag with all currencies
    createCountryCurrencies()

    // handle base64 image
    uploadBtn.onclick = (e) => {
        file.click()
    };

    file.onchange = (e) => {
        let newfile = file.files[0];
        let imageSrc = URL.createObjectURL(newfile);
        imgPreview.src = imageSrc
        let reader = new FileReader()
        reader.readAsDataURL(newfile);

        reader.onload = function () {
            base64Image = reader.result;
        };
    }

    submitBtn.onclick = async (e) => {
        if (base64Image === "") {
            alert.error("Product image is empty");
            return
        }
        else if (nameInp.value === "" || priceInp.value === "") {
            alert.error("fields cant be empty")
            return
        }
        else {

            let senddata = {
                pName: nameInp.value,
                pPrice: priceInp.value,
                pCurrency: currencyInp.value,
                orId: org.id,
                pImage: base64Image,
            }
            await sendData(senddata)
        }
    }

    const sendData = async (data) => {
        try {
            loading = true;
            submitBtn.innerHTML = "Loading ....."
            submitBtn.classList.add("loading")

            let api = "http://localhost:5000/kwickquick/api/addProducts"
            let { req, res } = await request(api, data, "post", {
                "content-type": "application/json",
                "authorization": `Bearer ${refreshToken}`
            });

            if (res === "" || !res) {
                qrcodeBox.innerHTML = "Product qrcode would be visible when products as been added."
                return;
            }
            else if (req.status === 200) {
                alert.success("Product added successfully")
                loading = false;
                submitBtn.innerHTML = "Submit"
                submitBtn.classList.remove("loading")
                qrcodeBox.innerHTML = ""
                new QRCode(qrcodeBox, {
                    text: res.productId,
                    width: 320,
                    height: 320,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        } catch (e) {
            console.log(e)
            alert.error("Something went wrong")
            loading = false;
            submitBtn.innerHTML = "Submit"
            submitBtn.classList.remove("loading")
            return
        }

    }

    qrcodeBtn.onclick = () => {
        qrcodeImageModal.style.visibility = "visible"
    }
}

// QRCODE PAGE CONT
const QRCODE_PAGE = () => {
    let downloadBtn = $(".download-btn");
    let qrcodesCount = $(".qrcodes-count")
    let qrcodeSidebar = $('.qrcode-sidebar');
    let mainQrcodeCont = $(".main-qrcode-cont")
    let qrcodeTableBody = $(".qrcode-table-body");
    let closeSidebar = $(".close-qrcode-btn")


    let { refreshToken, org } = getOrgInfo()

    // check if the details btn length is> 1
    mainQrcodeCont.innerHTML = ""

    // close sidebar
    closeSidebar.onclick = () => {
        qrcodeSidebar.style.width = "0px"
    }

    // render table data

    function renderTableData(data) {
        return `        
        <tr>
        <td>
          <div class="info">
            <div class="text">
              <span><b>${data.pName}</b></span>
              <span class="price">${data.pCurrency}${data.pPrice}</span>
            </div>
          </div>
        </td>
        <td>
          <span class="orgId">${data.orId}</span>
        </td>
        <td>
          <span class="orgId">${data.hash}</span>
        </td>
        <td>
          <span>${moment(data.pDate).format('MM, Do, YYYY')}</span>
        </td>
        <td>
          <button
            class="btn details qrcode-info-btn"
            data-qrcode-img="https://qrtag.net/api/qr_4.png"
            data-qrcode-item="${data.pName}"
            data-qrcode-orgId="${data.orId}"
            data-product-id="${data.id}"
            data-qrcode-hash="${data.hash}"
            data-qrcode-price="${data.pPrice}"
          >
            Details
          </button>
        </td>
      </tr>
        `
    }

    // fetch all data
    const getAllProducts = async () => {
        let api = "http://localhost:5000/kwickquick/api/all/getOrgProducts"

        let { req, res } = await request(api, { orgId: org.id }, "post", {
            "content-type": "application/json",
            "authorization": `Bearer ${refreshToken}`
        })

        qrcodesCount.innerHTML = res.length;

        if (req.status === 200 && res.length === 0) {
            qrcodeTableBody.innerHTML = "NO products available, try adding some"
            return
        }
        else if (req.status === 200 && res.length > 1) {
            res.forEach((data) => {
                qrcodeTableBody.innerHTML += renderTableData(data)
            })
            loadAfter()
        }
        else {
            qrcodeTableBody.innerHTML += renderTableData(res[0])
            loadAfter()

        }

    }

    getAllProducts()


    function loadAfter() {
        let qrcodeDetailsBtn = $all(".qrcode-info-btn");
        if (qrcodeDetailsBtn.length > 1) {
            qrcodeDetailsBtn.forEach(btn => {
                btn.onclick = (e) => {
                    // open up the sidebar
                    qrcodeSidebar.style.width = "250px"

                    let target = e.target;

                    let hash = target.getAttribute("data-qrcode-hash")
                    let itemName = target.getAttribute("data-qrcode-item")
                    let orgId = target.getAttribute("data-qrcode-orgId")
                    let price = target.getAttribute("data-qrcode-price")


                    mainQrcodeCont.innerHTML = `
                        <div class="top">
                            <div class="qrcode-img-cont"></div>
                            <div class="action">
                            <ion-icon name="download" class="download-qrcode download-btn"></ion-icon>
                            </div>
                        </div>
                        <div class="body">
                            <p><b>Name:</b></p>
                            <span>${itemName}</span>
                            <p><b>Hash:</b></p>
                            <span>${hash}</span>
                            <p><b>Price</b></p>
                            <span>${price}</span>
                        </div>
                    `
                    let qrcodeImgCont = $(".qrcode-img-cont");
                    let downloadQrcode = $(".download-qrcode");
                    let deleteBtn = $(".delete-qrcode");

                    generateQrcode(qrcodeImgCont, hash)

                    downloadQrcode.onclick = (e) => {
                        console.log()
                        let img = e.target.parentElement.parentElement.querySelector(".qrcode-img-cont img").src;
                        let src = img;
                        let a = document.createElement("a")
                        a.href = src;
                        a.download = "qrcode";
                        a.click()
                    }
                }
            })
            // return
        }
        qrcodeDetailsBtn[0].onclick = (e) => {
            // open up the sidebar
            qrcodeSidebar.style.width = "250px"

            let target = e.target;

            let hash = target.getAttribute("data-qrcode-hash")
            let itemName = target.getAttribute("data-qrcode-item")
            let orgId = target.getAttribute("data-qrcode-orgId")
            let price = target.getAttribute("data-qrcode-price")

            mainQrcodeCont.innerHTML = `
            <div class="top">
                <div class="qrcode-img-cont"></div>
    
                <div class="action">
    
                <ion-icon name="download" class="download-qrcode download-btn"></ion-icon>
                </div>
                
            </div>
            <div class="body">
                <p><b>Name:</b></p>
                <span>${itemName}</span>
                <p><b>Hash:</b></p>
                <span>${hash}</span>
                <p><b>Price</b></p>
                <span>${price}</span>
            </div>
          `
            let qrcodeImgCont = $(".qrcode-img-cont");
            let downloadQrcode = $(".download-qrcode");

            generateQrcode(qrcodeImgCont, hash)

            downloadQrcode.onclick = (e) => {
                console.log()
                let img = e.target.parentElement.parentElement.querySelector(".qrcode-img-cont img").src;
                let src = img;
                let a = document.createElement("a")
                a.href = src;
                a.download = "qrcode";
                a.click()
            }
        }
    }

    function generateQrcode(elm, text) {
        return new QRCode(elm, {
            text: text,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}


// PRODUCTS PAGE
const PRODUCTS_PAGE = () => {
    let nameInp = $(".pName")
    let priceInp = $(".pPrice")
    let currencyInp = $(".currencies");
    let uploadBtn = $(".upload")
    let file = $(".imageInp");
    let imgPreview = $(".product-image-preview");
    let submitBtn = $(".submit-btn");
    let chkImageEdit = $(".edit-image-chk");
    let editModal = $(".edit-product-modal");
    let closeModal = $(".close-modal");
    let editImageModal = $(".edit-image-modal");
    let closeEditImage = $(".close-editimage-modal");
    let editImageUploadBtn = $all(".edit-image-upload-btn");
    let tableBody = $(".products-table-body");
    let base64Image = "";
    let loading = false;

    let productId = "";

    let { refreshToken, org } = getOrgInfo()

    // render table data
    const renderTableData = (data) => {
        return `
        <tr>
        <td>
        <img
            src="${data.pImage}" alt="" width="30" height="30" class="img-fluid"
        />
        </td>
        <td>${data.pName}</td>
        <td>${data.pPrice}</td>
        <td>${data.orId.slice(0, 12)}...</td>
        <td>
        <span class="orgId">${moment(data.pDate).format('MM Do YYYY, h:mm:ss')}</span>
        </td>
        <td>
        <button
            class="btn products-info-btn product-edit-btn btn-success"
            data-qrcode-img="${data.pImage}"
            data-qrcode-item="${data.pName}"
            data-qrcode-orgId="${data.orId}"
            data-product-id="${data.id}"
            data-qrcode-hash="${data.hash}"
            data-qrcode-price="${data.pPrice}"
        >
            Edit
        </button>

        <button
            class="btn products-info-btn product-delete-btn btn-danger"
            data-orgId="${data.orId}"
            data-product-id="${data.id}"
        >
            Delete
        </button>
        </td>
    </tr>

`
    }


    // get all data
    const getAllProducts = async () => {
        let api = "http://localhost:5000/kwickquick/api/all/getOrgProducts"

        let { req, res } = await request(api, { orgId: org.id }, "post", {
            "content-type": "application/json",
            "authorization": `Bearer ${refreshToken}`
        })

        console.log(res)
        if (req.status === 200 && res.length === 0) {
            tableBody.innerHTML = "NO products available, try adding some"
            return
        }
        else if (req.status === 200 && res.length > 1) {
            res.forEach((data) => {
                tableBody.innerHTML += renderTableData(data)
            })
            loadAfter()
        }
        else {
            tableBody.innerHTML += renderTableData(res[0])
            loadAfter()

        }

    }

    getAllProducts()

    createCountryCurrencies()


    // handle base64 image
    uploadBtn.onclick = (e) => {
        file.click()
    };

    // close modal
    closeModal.onclick = () => {
        editModal.style.display = "none"
    }

    closeEditImage.onclick = () => {
        chkImageEdit.checked = false;
        editImageModal.style.display = "none"
    }

    function loadAfter() {

        let editBtn = $all(".product-edit-btn");
        let deleteBtn = $all(".product-delete-btn");

        // show the edit modal\
        if (editBtn.length > 1) {
            editBtn.forEach((btn) => {
                btn.onclick = (e) => {
                    editModal.style.display = "flex"
                    let target = e.target;
                    // return;
                    let itemName = target.getAttribute("data-qrcode-item");
                    let pId = target.getAttribute("data-product-id")
                    let orgId = target.getAttribute("data-qrcode-orgId")
                    let price = target.getAttribute("data-qrcode-price");

                    nameInp.value = itemName;
                    priceInp.value = price;

                    productId = pId;

                }
            })
        }
        else {
            editBtn[0].onclick = (e) => {
                editModal.style.display = "flex"

                let target = e.target;

                let itemName = target.getAttribute("data-qrcode-item")
                let orgId = target.getAttribute("data-qrcode-orgId")
                let price = target.getAttribute("data-qrcode-price");

                nameInp.value = itemName;
                priceInp.value = price;

                let pId = target.getAttribute("data-product-id")
                productId = pId;
            }
        }

        if (editImageUploadBtn.length > 1) {
            editImageUploadBtn.forEach((btn) => {
                btn.onclick = async (e) => {
                    let target = e.target.parentElement.parentElement;

                    let pId = target.getAttribute("data-product-id")
                    let orgId = target.getAttribute("data-qrcode-orgId")

                    if (base64Image === "") {
                        alert.error("No image is selected")
                        return;
                    }

                    // send data
                    try {
                        loading = true;
                        editImageUploadBtn.innerHTML = "Uploading..."
                        let { refreshToken, org } = getOrgInfo()

                        let data = {
                            pId,
                            orgId: org.id,
                            pImage: base64Image
                        }
                        let api = "http://localhost:5000/kwickquick/api/editProductImage"
                        let { req, res } = await request(api, data, "put", {
                            "content-type": "application/json",
                            "authorization": `Bearer ${refreshToken}`
                        })

                        if (req.status === 200) {
                            loading = false;
                            editImageUploadBtn.innerHTML = "Upload"
                            return alert.success("Image uploaded successfully")
                        } else {
                            loading = false;
                            editImageUploadBtn.innerHTML = "Upload"
                            return alert.error("Failed to update image, something went wrong")
                        }
                    } catch (e) {
                        loading = false;
                        editImageUploadBtn.innerHTML = "Upload"
                        return alert.error("Failed to update image, something went wrong")
                    }
                }
            })
        }
        else {
            editImageUploadBtn[0].onclick = async (e) => {
                let target = e.target.parentElement.parentElement;

                if (base64Image === "") {
                    alert.error("No image is selected")
                    return;
                }

                // send data
                try {
                    loading = true;
                    editImageUploadBtn.innerHTML = "Uploading..."
                    let data = {
                        pId: productId,
                        orgId: org.id,
                        pImage: base64Image
                    }
                    let api = "http://localhost:5000/kwickquick/api/editProductImage"
                    let { req, res } = await request(api, data, "put", {
                        "content-type": "application/json",
                        "authorization": `Bearer ${refreshToken}`
                    })
                    console.log(res)
                    if (req.status === 200) {
                        loading = false;
                        editImageUploadBtn.innerHTML = "Upload"

                        alert.success("Image uploaded successfully")
                        setTimeout(() => {
                            location.reload(true)
                        }, 1000);
                        return
                    } else {
                        loading = false;
                        editImageUploadBtn.innerHTML = "Upload"
                        return alert.error("Failed to update image, something went wrong")
                    }
                } catch (e) {
                    loading = false;
                    editImageUploadBtn.innerHTML = "Upload"
                    alert.error("Failed to update image, something went wrong");
                    setTimeout(() => {
                        location.reload(true)
                    }, 1000);
                    return
                }
            }
        }

        // delete products
        if (deleteBtn.length > 1) {
            deleteBtn.forEach((btn) => {
                btn.onclick = async (e) => {
                    let target = e.target;
                    let pId = target.getAttribute("data-product-id")
                    let orgId = target.getAttribute("data-orgId")

                    try {
                        let api = "http://localhost:5000/kwickquick/api/deleteProduct"
                        let { req, res } = await request(api, { pId, orgId }, "delete", {
                            "content-type": "application/json",
                            "authorization": `Bearer ${refreshToken}`
                        })
                        if (req.status === 200) {
                            alert.success("Product deleted successfully")
                            loading = false;
                            setTimeout(() => {
                                location.reload(true)
                            }, 1000);
                            return;
                        } else {
                            alert.error(res.message)
                            return;
                        }
                    } catch (e) {
                        alert.error("Something went wrong deleteing item, please try later")
                        loading = false;
                    }
                }
            })
            return;
        }
        else {
            deleteBtn[0].onclick = async (e) => {
                let target = e.target;

                let pId = target.getAttribute("data-product-id")
                let orgId = target.getAttribute("data-orgId")
                console.log(pId, orgId)
                try {
                    let api = "http://localhost:5000/kwickquick/api/deleteProduct"
                    let { req, res } = await request(api, { pId, orgId }, "delete", {
                        "content-type": "application/json",
                        "authorization": `Bearer ${refreshToken}`
                    })
                    console.log(res)
                    if (req.status === 200) {
                        alert.success("Product deleted successfully")
                        loading = false;
                        setTimeout(() => {
                            location.reload(true)
                        }, 1000);
                        return;
                    } else {
                        alert.error(res.message)
                    }
                } catch (e) {
                    alert.error("Something went wrong deleteing item, please try later")
                    loading = false;
                }
            }
        }

    }



    file.onchange = (e) => {
        let newfile = file.files[0];
        let imageSrc = URL.createObjectURL(newfile);
        imgPreview.src = imageSrc
        let reader = new FileReader()
        reader.readAsDataURL(newfile);
        reader.onload = function () {
            base64Image = reader.result;
        };
    }

    submitBtn.onclick = async (e) => {
        if (nameInp.value === "" || priceInp.value === "") {
            alert.error("fields cant be empty")
            return
        }
        else {
            let orgId = org.id;
            let senddata = {
                pName: nameInp.value,
                pPrice: priceInp.value,
                pCurrency: currencyInp.value,
                pId: productId,
                orId: orgId,
            }
            await sendData(senddata)
        }
    }

    // edit product
    const sendData = async (data) => {
        try {
            loading = true;
            submitBtn.innerHTML = "Loading ....."
            submitBtn.classList.add("loading")

            let api = "http://localhost:5000/kwickquick/api/editProduct"
            let { req, res } = await await request(api, data, "put", {
                "content-type": "application/json",
                "authorization": `Bearer ${refreshToken}`
            })

            if (req.status === 200) {
                alert.success("Product updated successfully")
                loading = false;
                submitBtn.innerHTML = "Submit"
                submitBtn.classList.remove("loading")
                setTimeout(() => {
                    location.reload(true)
                }, 1000);
                return;
            }
            else {
                alert.error(res.message)
            }
        } catch (e) {
            alert.error("Something went wrong")
            loading = false;
            submitBtn.innerHTML = "Submit"
            return
        }

    }

    // edit image
    chkImageEdit.onclick = (e) => {
        if (!chkImageEdit.checked) {

            editImageModal.style.display = "none"
            return
        };
        editImageModal.style.display = "flex"
    }

}


