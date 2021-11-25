



const $ = (elm) => {
    return document.querySelector(elm)
}

const $all = (elm) => {
    return document.querySelectorAll(elm)
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

const NavBarDropDown = () => {
    let dropdowncont = $(".dropdown-content");
    let dropdownicon = $(".dropdown-icon");

    dropdownicon.onclick = () => {
        dropdowncont.classList.toggle("active")
    }
}



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
                orId: "somerandomid",
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
            let req = await fetch("http://localhost:5000/kwickquick/api/addProducts", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                    "authorization": `Bearer`
                },
                body: JSON.stringify(data)
            })
            let result = await req.json();

            console.log(result)
            if (result === "" || !result) {
                qrcodeBox.innerHTML = "Product qrcode would be visible when products as been added."
                return;
            }
            else if (req.status === 200) {
                alert.success("Product added successfully")
                loading = false;
                submitBtn.innerHTML = "Submit"
                submitBtn.classList.remove("loading")
                // qrcodeBox.innerHTML = `
                //     <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${result.productId}" />
                // `
                qrcodeBox.innerHTML = ""
                new QRCode(qrcodeBox, {
                    text: result.productId,
                    width: 320,
                    height: 320,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        } catch (e) {
            alert.error("Something went wrong")
            loading = false;
            submitBtn.innerHTML = "Submit"
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
    let deleteBtn = $(".delete-btn");
    let qrcodeSidebar = $('.qrcode-sidebar');
    let mainQrcodeCont = $(".main-qrcode-cont")
    let qrcodeTableBody = $(".qrcode-table-body");
    let qrcodeDetailsBtn = $all(".qrcode-info-btn");
    let closeSidebar = $(".close-qrcode-btn")

    // check if the details btn length is> 1
    mainQrcodeCont.innerHTML = ""

    // close sidebar
    closeSidebar.onclick = () => {
        qrcodeSidebar.style.width = "0px"
    }




    if (qrcodeDetailsBtn.length > 1) {
        qrcodeDetailsBtn.forEach(btn => {
            btn.onclick = (e) => {
                // open up the sidebar
                qrcodeSidebar.style.width = "250px"

                let target = e.target;

                let img = target.getAttribute("data-qrcode-img")
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

                deleteBtn.onclick = (e) => {
                    deleteQrcode(hash);
                }
            }
        })
        // return
    }
    qrcodeDetailsBtn[0].onclick = (e) => {
        // open up the sidebar
        qrcodeSidebar.style.width = "250px"

        let target = e.target;

        let img = target.getAttribute("data-qrcode-img")
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

    function deleteQrcode(hash) {
        return async () => {
            let senddata = {
                pId: "b03e9dae-96ff-47e4-a867-9d6f454b336f",
                orId: "b50b9c7c-1ba1-4665-b39f-f61865a49792"
            }

            let api = "http://localhost:5000/kwickquick/api/deleteQrcodeHash"
            let req = await fetch(api, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM1YjkyMDQ5LWVlMjktNDEzYS1hNDIxLTY2NzJjYjk5NDRkZSIsImVtYWlsIjoidGVzbGEzQG1haWwuY29tIiwiaWF0IjoxNjM3NTE5OTI3LCJleHAiOjE2NjkwNzc1Mjd9.AK4kG0T9gM0KaxoqsaspX2EDTYq3P4bLuiHgomfKkIQ"
                },
                body: JSON.stringify(senddata)
            })

            let result = await req.json();

            console.log(result)
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
    let editBtn = $all(".product-edit-btn");
    let deleteBtn = $all(".product-edit-btn");
    let editModal = $(".edit-product-modal");
    let closeModal = $(".close-modal");
    let editImageModal = $(".edit-image-modal");
    let closeEditImage = $(".close-editimage-modal");
    let editImageUploadBtn = $(".edit-image-upload-btn")

    let base64Image = "";
    let loading = false;

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

    // show the edit modal
    if (editBtn.length > 1) {
        editBtn.forEach((btn) => {
            btn.onclick = (e) => {
                editModal.style.display = "flex"

                let target = e.target;

                let hash = target.getAttribute("data-qrcode-hash")
                let itemName = target.getAttribute("data-qrcode-item")
                let orgId = target.getAttribute("data-qrcode-orgId")
                let price = target.getAttribute("data-qrcode-price");

                nameInp.value = itemName;
                priceInp.value = price;


            }
        })
    }
    else {
        editBtn[0].onclick = (e) => {
            editModal.style.display = "flex"

            let target = e.target;

            let hash = target.getAttribute("data-qrcode-hash")
            let itemName = target.getAttribute("data-qrcode-item")
            let orgId = target.getAttribute("data-qrcode-orgId")
            let price = target.getAttribute("data-qrcode-price");

            nameInp.value = itemName;
            priceInp.value = price;

        }
    }
    let test = ""
    editBtn.onclick = (e) => {
        editModal.style.display = "flex"

        let target = e.target;

        let pId = target.getAttribute("data-product-id")
        let itemName = target.getAttribute("data-qrcode-item")
        let orgId = target.getAttribute("data-qrcode-orgId")
        let price = target.getAttribute("data-qrcode-price");

        nameInp.value = itemName;
        priceInp.value = price;

    }

    editImageUploadBtn.onclick = async (e) => {
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
            let data = {
                pId,
                orgId,
                pImage: base64Image
            }
            let api = "http://localhost:5000/kwickquick/api/editProductImage"
            let { req, res } = await request(api, data, "put", {
                "content-type": "application/json",
                "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM1YjkyMDQ5LWVlMjktNDEzYS1hNDIxLTY2NzJjYjk5NDRkZSIsImVtYWlsIjoidGVzbGEzQG1haWwuY29tIiwiaWF0IjoxNjM3NTE5OTI3LCJleHAiOjE2NjkwNzc1Mjd9.AK4kG0T9gM0KaxoqsaspX2EDTYq3P4bLuiHgomfKkIQ"
            })
            console.log(res)
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
            return alert.error("Failed to update image, something went wrong")
        }
    }

    // edit image data and send

    // resize image
    // const resizeImg = (fileData, mimeType)=>{
    //     let img = document.createElement("img")
    //     img.width = 200
    //     img.height = 200;
    //     img.src = imgPreview.src
    //     let canvas = document.createElement("canvas");
    //     canvas.width = 250;
    //     canvas.height = 250;
    //     let newimg = imgPreview
    //     let ctx = canvas.getContext("2d")
    //     img.onload = ()=>{
    //         ctx.drawImage(img, 0,0, canvas.width, canvas.height)
    //     }
    //     let blob = canvas.toDataURL(mimeType)
    //     // img.src = blob;
    //     console.log(blob, imgPreview.src)
    // }

    file.onchange = (e) => {
        let newfile = file.files[0];
        let imageSrc = URL.createObjectURL(newfile);
        imgPreview.src = imageSrc
        let reader = new FileReader()
        reader.readAsDataURL(newfile);

        // resizeImg(newfile, newfile.type)

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

            let senddata = {
                pName: nameInp.value,
                pPrice: priceInp.value,
                pCurrency: currencyInp.value,
                orId: "somerandomid",
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
            let { req, res } = await await request(api, data, "put", {
                "content-type": "application/json",
                "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM1YjkyMDQ5LWVlMjktNDEzYS1hNDIxLTY2NzJjYjk5NDRkZSIsImVtYWlsIjoidGVzbGEzQG1haWwuY29tIiwiaWF0IjoxNjM3NTE5OTI3LCJleHAiOjE2NjkwNzc1Mjd9.AK4kG0T9gM0KaxoqsaspX2EDTYq3P4bLuiHgomfKkIQ"
            })

            console.log(result)
            if (res === "" || !res) {
                qrcodeBox.innerHTML = "Product qrcode would be visible when products as been added."
                return;
            }
            else if (req.status === 200) {
                alert.success("Product added successfully")
                loading = false;
                submitBtn.innerHTML = "Submit"
                submitBtn.classList.remove("loading")
                // qrcodeBox.innerHTML = `
                //     <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${result.productId}" />
                // `
                qrcodeBox.innerHTML = ""
                new QRCode(qrcodeBox, {
                    text: result.productId,
                    width: 320,
                    height: 320,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
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