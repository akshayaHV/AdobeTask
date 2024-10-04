"use strict";
let startIndex = 0;
let endIndex = 10;
let dataList = undefined;
let dataListOnFilter = undefined;



let item = "";
let filterProductsOnCategories = [];

let sortByPrice = "";
let searchedText = "";

let showMoreItems = `<button  class="text-center showmore">Show more</button></div>`;
let loader = [1,2,3,4,5,6,7,8,9,10].map(res => {return `<div class="shimmer-loader"></div>`}).join('');

let showMoreItemSection = document.getElementById('showmoreItemDiv');
let productListSection = document.getElementById('productListDiv');

async function fetchProductList() {
    try {
        const data = await fetch('https://fakestoreapi.com/products');
        if (!data.ok) {
            throw new Error('Network data was not ok');
        }
        dataList = await data.json();
        dataListOnFilter = dataList;
        console.log(dataList); // Output the data to the console
        bindResultCount();
        addProductsToContainer(dataListOnFilter.reverse());
    } catch (error) {
        productListSection.innerHTML = `<p class="word-wrap ml">Something went wrong,Please try again!...</p>`;
        document.getElementById('errorPopup').style.display = 'block';
    }
}

//List of Products count
function bindResultCount() {
    let resultCount = `<p class="text-nowrap ml resultsVal">${productListSection.children.length} Results</p>`;
    let resultCountElem = document.getElementById('resultstxt');
    let mobileResultCountElem = document.getElementById('mobileResultstxt');
    resultCountElem.innerHTML = resultCount;
    mobileResultCountElem.innerHTML = resultCount;
}

productListSection.innerHTML = loader;
fetchProductList();

//List of Products
function addProductsToContainer(data, loardMore = false) {
    if (!loardMore) item = "";
    for (let i = startIndex; i < (endIndex < data.length ? endIndex : data.length); i++) {
        item = item + `<div class="product" onclick="window.location.href='#'">
                <img src="${data[i].image}" class="bg-secondary" alt="">
                <p class="product-title"><b>${data[i].title}</b></p>
                <p><b>${'$' + data[i].price}</b></p>
                <div class="heartImg"><img src="./assets/images/heart.png" /></div>
            </div>`;
    }
    if (dataListOnFilter.length > 10) {
        showMoreItemSection.innerHTML = showMoreItems;
        document.querySelector('.showmore').addEventListener('click', showMoreProducts);
    }
    if (endIndex >= dataListOnFilter.length) {
        document.querySelector('.showmore') && document.querySelector('.showmore').remove();
    }
    productListSection.innerHTML = item;
    bindResultCount();
}

function findProduct(searchText) {
    searchedText = searchText;
    filterProducts('',false,true);
}

//filter products based on category, search text
function filterProducts(categoryName, checked, searchFlag=false) {
    startIndex = 0;
    endIndex = 10;
    
    if (checked) {
        filterProductsOnCategories.push(categoryName);
    } else {
        !searchFlag && filterProductsOnCategories.splice(filterProductsOnCategories.indexOf(categoryName), 1);
    }

    dataListOnFilter = filterProductsOnCategories.length === 0 
    ? dataList 
    : dataList.filter(productObj => filterProductsOnCategories.includes(productObj.category));

    if (searchedText) {
        dataListOnFilter = dataListOnFilter.filter(item => item.title.toLowerCase().includes(searchedText.toLowerCase()));
    }
    
    sortProducts(sortByPrice);
};

//ascending sort
const sortByPriceAsc = (items) => {
    return items.slice().sort((a, b) => a.price - b.price);
};

//descending sort
const sortByPriceDesc = (items) => {
    return items.slice().sort((a, b) => b.price - a.price);
};

//sort products based on price
function sortProducts(sortType) {
    sortByPrice = sortType;
    startIndex = 0;
    endIndex = 10;
    if (sortType === 'asc') {
        dataListOnFilter = sortByPriceAsc(dataListOnFilter);
    } else if (sortType === 'desc') {
        dataListOnFilter = sortByPriceDesc(dataListOnFilter);
    }
    addProductsToContainer(dataListOnFilter);
}

//lazy loading products
function showMoreProducts() {
    startIndex = endIndex;
    endIndex += 10;
    addProductsToContainer(dataListOnFilter, true);
}

document.getElementById('toggleFilterSidebar').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
});

document.getElementById('closeSidebar').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
});

document.getElementsByClassName('close')[0].onclick = function() {
    document.getElementById('errorModal').style.display = 'none';
}

document.getElementById('retry-button').onclick = function() {
    document.getElementById('errorModal').style.display = 'none';
    productListSection.innerHTML = loader;
    fetchProductList();
}

document.getElementById('cancel-button').onclick = function() {
    document.getElementById('errorModal').style.display = 'none';
}