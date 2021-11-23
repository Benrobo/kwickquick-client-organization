



const $ = (elm)=>{
    return document.querySelector(elm)
}

const $all = (elm)=>{
    return document.querySelectorAll(elm)
}

const NavBarDropDown = ()=>{
    let dropdowncont = $(".dropdown-content");
    let dropdownicon = $(".dropdown-icon");

    dropdownicon.onclick = ()=>{
        dropdowncont.classList.toggle("active")
    }
}



const ProductsDetails = ()=>{
    let detailsBtn = $all(".products-details-btn");
    let productModal = $(".products-info-modal");

    let closeModalBtn = $(".close-products-modal");

    detailsBtn.forEach((btn)=>{
        btn.onclick = (e)=>{
            productModal.style.display = "flex"
        }
    })

    closeModalBtn.onclick = ()=>{
        productModal.style.display = "none"
    }

}















