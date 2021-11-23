



const $ = (elm) => {
    return document.querySelector(elm)
}

const $all = (elm) => {
    return document.querySelectorAll(elm)
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


const ADD_PRODUCTS = async () => {
    let nameInp = $(".pName")
    let priceInp = $(".pPrice")
    let pNumber = $(".pNumber");
    let currencyInp = $(".currencies");
    let uploadBtn = $(".upload")
    let file = $(".imageInp");
    let imgPreview = $(".product-image-preview");
    let submitBtn = $(".submit-btn");

    let base64Image = "";

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

    submitBtn.onclick = async (e)=>{
        if(base64Image === ""){
            alert("Product image is empty");
            return
        }
        else if(nameInp.value === "" || priceInp.value === "" || pNumber.value === ""){
            alert("fields cant be empty")
            return 
        }
        else{
            
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

    const sendData = async (data)=>{
        let req = await fetch("http://localhost:5000/kwickquick/api/addProducts", {
            method: "post",
            headers:{
                "content-type": "application/json",
                "authorization": `Bearer`
            },
            body: JSON.stringify(data)
        })
        let res = await req;

        console.log(res)
    }
}









