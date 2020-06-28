
// jQuery 控制sidebar的開闔
$(document).ready(function(){
    //點到<收合的按鈕時就關閉sidebar
    $('#btnId').on('click',function(){
        $('#menu').toggleClass('active');  
    })
    //點到藥局的區域就自動關閉sidebar
    $('#addleftMenu').on('click',function(){
        $('#menu').toggleClass('active');
    })  
})


/*****    header     ************/

//取得日期
let date;
let day;
let weekDay;
let weekend;

function getdate() {
    date = new Date();
    day = date.getDay();
    weekDay = new Array();

    weekDay[0] = "日";
    weekDay[1] = "一";
    weekDay[2] = "二";
    weekDay[3] = "三";
    weekDay[4] = "四";
    weekDay[5] = "五";
    weekDay[6] = "六";

    weekend = weekDay[day];
    // console.log(day);

    //今天日期
    let today = (date.getMonth() + 1) + ' / ' + (date.getDate()) + ' ( ' + weekend + ' )';

    //年
    document.querySelector('.nowyear').innerHTML = date.getFullYear();
    //月份日期
    document.querySelector('.date h1').innerHTML = today;
    //紀錄七天後的日期
    let theday = new Date();
    let changeDay = 7;
    let sevenDay = theday.setDate(theday.getDate() + changeDay);
    let rememberNextDay = theday.toLocaleDateString();

    document.querySelector('.remind em').innerHTML = rememberNextDay + '(' + weekend + ')';

};
getdate();


// 監聽身分證輸入末碼按鈕
let idBtn = document.querySelector('.id');
idBtn.addEventListener('click', checkIdNum, false);

function checkIdNum(e) {
    if (e.target.nodeName !== "INPUT") { return };
    let btnValue = parseInt(e.target.value);
    // console.log(btnValue);
    let idBuy = document.querySelector('.idBuy');

    //判斷身分證尾碼在星期幾可以購買
    //偶數天＋身分證尾碼是偶數
    if ((day == 2 || day == 4 || day == 6) && (btnValue % 2 == 0)) {
        idBuy.innerHTML = '<p class="idBuyStyle"> 您的尾碼為' + btnValue + '，今日可購買口罩喔 </p>';
        idBuy.style.color = "rgb(247, 247, 23)";
        //奇數天＋身分證尾碼是奇數
    } else if ((day == 1 || day == 3 || day == 5) && (btnValue % 2 == 1)) {
        idBuy.innerHTML = '<p> 您的尾碼為' + btnValue + '，今日可購買口罩喔 </p>';
        idBuy.style.color = "rgb(247, 247, 23)";
        //星期日全都可以買
    } else if (day == 0 && (((btnValue % 2) == 0 || (btnValue % 2) == 1))) {
        idBuy.innerHTML = '<p> 您的尾碼為' + btnValue + '，今日可購買口罩喔 </p>';
        idBuy.style.color = "rgb(247, 247, 23)";
    } else {
        idBuy.innerHTML = '<p> 您的尾碼為' + btnValue + '，今日不能購買口罩喔 </p>';
        idBuy.style.color = "rgb(0, 26, 255)";

    };
};

/*********** sidebar  */

// 帶入台灣縣市地區資料
let data;

const elCounty = document.getElementById('addressCounty');
const elTown = document.getElementById('addressTown');

// 初始化
function init(){
    getData();
}
;
function getData() {
    const url = '../city.json';//相對路徑
   
    let xhrCity = new XMLHttpRequest();
    xhrCity.open('get', url, true);
    xhrCity.send();
    xhrCity.onload = function() {

        data = JSON.parse(xhrCity.responseText);
        console.log(data);

        getCityName();//取得縣市資料
       
    };
};
getData();

 
//取得縣市資料，並將資料印到option內
let city;
function getCityName(){
    city=[];//儲存縣市名稱CityName  
    let countyStr = '';
    //取得縣市乾淨陣列
    data.forEach(function(item,index){
        //將資料新增push到city空陣列中
        city.push(item.CityName);         
    });
    // console.log(city);

    // 再透過foreach將縣市資料放進option選單中
    
    city.forEach(function(item,index){
        var townStrtaipei = "";
        countyStr+= `
        <option value='${index}'>${city[index]}</option> 
        `;
        elCounty.innerHTML = countyStr;
        
    });
  

}


//取得地區資料，監聽使用者change事件（選的地區），並印到option內

function getRegion(cityName){
    //cityName是選到的縣市，將他帶入就可印出地區名稱
  
    let townStr = '';
    let regionName = data[cityName].AreaList;
    // console.log(regionName);
    
    //印出所有的地區名稱
    regionName.forEach(function(item,index){
        townStr += `
        <option>${item.AreaName} </option>
        `;
        elTown.innerHTML = townStr;
    // console.log(item.AreaName);//印出所有地區
    });
    
};


/***********  Map地圖   */
let map = L.map('map', {
    
    center: [24.13977, 120.71560], //定位點
    zoom: 14 //伸縮地圖

});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// 綠色按鈕的設計
const greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
// 紅色按鈕的設計
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})


// 新增一個圖層，放icon的群組
const markers = new L.MarkerClusterGroup().addTo(map);

//ajax取得藥局資料
let mapData;
let addrData;
function getMapData() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR3C_WUR1iWG73l4W6xjsCLD2tksnd-r_aO5j8YQfFh3HRDtxrAXVbKr9io');
    xhr.send();
    xhr.onload = function() {
        mapData = JSON.parse(xhr.responseText).features;
        // console.log(mapData);
       
        renderList();
        showPopUp();
    };
};
getMapData();

// 在地圖上顯示popup
function showPopUp(){
    for (let i = 0; i < mapData.length; i++) {
        // console.log(data[i].name)
        
        markers.addLayer(L.marker([mapData[i].geometry.coordinates[1], mapData[i].geometry.coordinates[0]], { icon: greenIcon }).bindPopup(
            `<div class="title mapPopup ">
                <h2>${mapData[i].properties.name}</h2>
                <a href="https://www.google.com.tw/maps/dir//${mapData[i].properties.address}" class="fas fa-location-arrow popup" target="_blank"></a>
                <p>${mapData[i].properties.address}</p>
                <p><i class="fas fa-phone-alt"></i>${mapData[i].properties.phone}</p>
                <p><i class="fas fa-clipboard"></i>${mapData[i].properties.note}</p>
                <div class="popup_leftMask">
                    <div class="popup_adult">成人：${mapData[i].properties.mask_adult}</div>
                    <div class="popup_baby">兒童：${mapData[i].properties.mask_child}</div>
                </div>
            </div>`
        ));
    }
    map.addLayer(markers);
};

//口罩尺寸
const maskAdultOrChild = document.getElementById('mask');  
// 搜尋按鈕
const serchBtn = document.getElementById('serchBtn');

// 印出選到縣市的地區
let saveSelectCounty;
function showRegion(e){
    saveSelectCounty = e.target.value;
    
    getRegion(saveSelectCounty );//選到特定縣市帶入印出地區
};
        

//   儲存使用者選擇的地區 
let saveSelectRegion;
function saveRegion(e){ 
    saveSelectRegion = e.target.value; 
    // console.log(saveSelectRegion);
} 


//儲存使用者選擇查詢的口罩尺寸
let saveAdult_Child;
function saveMaskSize(e){
    saveAdult_Child=e.target.value;
    // console.log(saveAdult_Child);
}

let countyData;
function serchMaskArea() {
    countyData=[];
    data.forEach(function(item,index){
        if( index == saveSelectCounty){
            countyData.push(item.CityName);//取得縣市的字串
        }
    });
    // console.log(countyData);
   
    renderList(countyData,saveSelectRegion,saveAdult_Child);
    
}

//監聽縣市按鈕change事件
elCounty.addEventListener('change',showRegion,false);
//監聽使用者選的地區
elTown.addEventListener('change',saveRegion,false);
//監聽口罩尺寸 
maskAdultOrChild.addEventListener('change',saveMaskSize,false);
// 監聽搜尋按鈕btn
serchBtn.addEventListener('click', serchMaskArea,false);


 
function renderList(countyData,saveSelectRegion,saveAdult_Child){
      
    let leftMenu = "";
    let adultData=[];
    let childData=[];
    mapData.forEach(function(item,index){
        //1.如果選出來的縣市跟地區匹配，就先將資料存入addressData的陣列
        if(item.properties.county==countyData&&item.properties.town == saveSelectRegion && saveAdult_Child == 'maskAll'){
            adultData.push(item);
          
        }else if (item.properties.county==countyData&&item.properties.town == saveSelectRegion && saveAdult_Child == 'maskAdult'){
            adultData.push(item);
      
        }else if (item.properties.county==countyData&&item.properties.town == saveSelectRegion && saveAdult_Child == 'maskChild'){
            childData.push(item);
      
        }
    });
    //口罩數量排序:多->少  
    // 2.再依”成人“口罩數量排序
    adultData.sort(function(a,b){
        return b.properties.mask_adult - a.properties.mask_adult; //由高排到低 
    });
  
    //2.依”兒童“口罩數量排序
    childData.sort(function(a,b){
    return b.properties.mask_child - a.properties.mask_child; //由高排到低
    });

    switch (saveAdult_Child){
        case 'maskAll':
                adultData.forEach(function(item,index){
              leftMenu += `
                <div class="title">
                    <a href="#" 
                        data-note=${item.properties.note}
                        data-lat=${item.geometry.coordinates[1]} 
                        data-lng=${item.geometry.coordinates[0]} 
                        data-name=${item.properties.name} 
                        data-addr=${item.properties.address}
                        data-phone=${item.properties.phone}
                        data-adult=${item.properties.mask_adult}
                        data-child=${item.properties.mask_child}>
                    ${item.properties.name} 
                    </a>
                    <a href="https://www.google.com.tw/maps/dir// ${item.properties.address}" class="fas fa-location-arrow" target="_blank"></a>
                    <p>${item.properties.address}</p>
                    <p>電話：${item.properties.phone}</p>
                    <div class="addleftMask">
                        <div class="addleftMenu_adult">
                            成人：${item.properties.mask_adult}
                        </div>
                        <div class="addleftMenu_baby">
                            兒童：${item.properties.mask_child}
                        </div>  
                    </div>
                </div>  
                `; 
            });
            document.querySelector('.addleftMenu').innerHTML = leftMenu;
            break;
        case 'maskAdult':
                adultData.forEach(function(item,index){
                leftMenu += `
                <div class="title">
                    <a href="#" 
                        data-note=${item.properties.note} 
                        data-lat=${item.geometry.coordinates[1]} 
                        data-lng=${item.geometry.coordinates[0]} 
                        data-name=${item.properties.name} 
                        data-addr=${item.properties.address}
                        data-phone=${item.properties.phone}
                        data-adult=${item.properties.mask_adult}
                        data-child=${item.properties.mask_child}>
                    ${item.properties.name} 
                    
                    </a>
                    <a href="https://www.google.com.tw/maps/dir// ${item.properties.address}" class="fas fa-location-arrow" target="_blank"></a>
                    <p>${item.properties.address}</p>
                    <p>電話：${item.properties.phone}</p>
                    <div class="addleftMask">
                        <div class="addleftMenu_adult onlyAdult">
                            成人：
                            <span>
                            ${item.properties.mask_adult}
                            </span>
                        </div> 
                    </div>
                </div>  
                `;
                })
                document.querySelector('.addleftMenu').innerHTML = leftMenu;
            break;
        case 'maskChild':
                childData.forEach(function(item,index){
                leftMenu += `
                <div class="title">
                    <a href="#" 
                        data-note=${item.properties.note} 
                        data-lat=${item.geometry.coordinates[1]} 
                        data-lng=${item.geometry.coordinates[0]} 
                        data-name=${item.properties.name} 
                        data-addr=${item.properties.address}
                        data-phone=${item.properties.phone}
                        data-adult=${item.properties.mask_adult}
                        data-child=${item.properties.mask_child}>
                    ${item.properties.name} 
                    
                    </a>
                    <a href="https://www.google.com.tw/maps/dir// ${item.properties.address}" class="fas fa-location-arrow" target="_blank"></a>
                    <p>${item.properties.address}</p>
                    <p>電話：${item.properties.phone}</p>
                    <div class="addleftMask">
                        <div class="addleftMenu_baby onlyChild">
                            兒童：
                            <span> 
                            ${item.properties.mask_child}
                            </span>
                        </div> 
                    </div>
                </div>  
                `;
            })
            document.querySelector('.addleftMenu').innerHTML = leftMenu;
            break;
    }

};


//當使用者按到想去的藥局時，將地圖轉到正確的位置
function flyToStore(lat,lng){
    map.flyTo(
        [lat,lng],18);  
           
}

//點選左側藥局名稱，地圖會順利移動到該地
//取得a連結內所綁定的data-*資料
let getListDataset=document.querySelector('.addleftMenu');

getListDataset.addEventListener('click',function(e){
    let clickTag=e.target.nodeName;//觀察點到的節點
    if(clickTag!== "A"){return};    //如果點到的不是<a>標籤，就不動作
    let lat=e.target.dataset.lat;   //取出緯度
    let lng=e.target.dataset.lng;   //取出經度
    let pharmacyNote=e.target.dataset.note;
    let pharmacyName=e.target.dataset.name;
    let pharmacyAddr=e.target.dataset.addr;
    let pharmacyPhone=e.target.dataset.phone;
    let pharmacyAdult=e.target.dataset.adult;
    let pharmacychild=e.target.dataset.child;
    // console.log(lat,lng,pharmacyNote,pharmacyName,pharmacyAddr,pharmacyAdult,pharmacychild,pharmacyPhone);
    flyToStore(lat,lng);  //呼叫並將值傳送到flyToStore的參數內
  
    openPopUp(lat,lng,pharmacyNote,pharmacyName,pharmacyAddr,pharmacyAdult,pharmacychild,pharmacyPhone);
})

let popupContent;
function openPopUp(lat,lng,pharmacyNote,pharmacyName,pharmacyAddr,pharmacyAdult,pharmacychild,pharmacyPhone){
   
    popupContent =
    `<div class="title mapPopup ">
        <h2>${pharmacyName}</h2>
        <a href="https://www.google.com.tw/maps/dir//${pharmacyAddr}" class="fas fa-location-arrow popup" target="_blank"></a>
        <p>${pharmacyAddr}</p>
        <p><i class="fas fa-phone-alt"></i>${pharmacyPhone}</p>
        <p><i class="fas fa-clipboard"></i>${pharmacyNote}</p>
        <div class="popup_leftMask">
            <div class="popup_adult">成人：${pharmacyAdult}</div>
            <div class="popup_baby">兒童：${pharmacychild}</div>
        </div>
    </div>`;
    let popup = L.popup()
    .setLatLng([lat,lng])
    .setContent(popupContent)
    .openOn(map);
    
};
