



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
    closeQrcodeModal.onclick = ()=>{
        qrcodeImageModal.style.visibility = "hidden"
    }

    // fill the select tag with all currencies
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
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            }
        } catch (e) {
            return alert.error("Something went wrong")
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
                      <img src="${img}" alt="qrcode" class="img-fluid">
                      <a class="download btn" href="${img}" download="true">Download</a>
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
                      <img src="${img}" alt="qrcode" class="img-fluid">
                      <a class="download btn" onclick="javacript:void()" href="javacript:void(${img})" download="true">Download</a>
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
    }


}
