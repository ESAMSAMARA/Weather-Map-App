// تعريف ثابت لمفتاح API
const API_KEY = 'YOUR_API_KEY'; // استبدل YOUR_API_KEY بمفتاح API الخاص بك
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const MAIN_API_KEY = "75388a768e34e5ab1a1abfa075bebc9c"

// جلب جميع عناصر html 
let city_name = document.querySelector('#city-name');
let country_name = document.querySelector('#country-name');
let wind_speed = document.querySelector('#wind-speed');
let humidity = document.querySelector('#humidity');
let temperature = document.querySelector('#temperature');
let gust = document.querySelector('#gust');
let refresh = document.querySelector(".refresh")
let container_view = document.querySelector('#container-view')
let loading = document.querySelector('.loading')


window.onload = function () {
    getLocation()
}


// طلب الاذن من المستخدم لجلب صلاحية الموقع 
function getLocation() {
    isLoading(false)
    // التأكد من دعم المتصفح لواجهة Geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        isLoading(false)
        alert("متصفحك لا يدعم تحديد الموقع الجغرافي");
    }
}

// تفعيل حالة الانتظار للموقع بناء على صلاحية استخدم موقع الخاص بالمستخدم
function isLoading(check) {
    if (!check) {
        loading.style.display = "block"
        container_view.style.display = "none"
    } else {
        loading.style.display = "none"
        container_view.style.display = "grid"
    }
}

// تحديث حالة الطقس مرة اخرى
refresh.addEventListener('click', function () {
    getLocation()
})

// الدالة التي تُنفذ عند نجاح جلب الموقع
function successCallback(position) {
    const latitude = position.coords.latitude; // خط العرض
    const longitude = position.coords.longitude; // خط الطول
    isLoading(true)
    // جلب حالة الطقس حسب الموقع الجغرافي
    getWeatherData(latitude, longitude)
        .then(weather => {
            city_name.innerHTML = weather.city
            country_name.innerHTML = weather.country
            wind_speed.innerHTML = weather.wind_speed
            humidity.innerHTML = weather.humidity
            temperature.innerHTML = weather.temperature
            gust.innerHTML = `${weather.gusts ? weather.gusts : 0} %`;
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}

// الدالة التي تُنفذ عند حدوث خطأ أثناء جلب الموقع
function errorCallback(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("يرجى قبول الإذن للوصول إلى الموقع");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("الموقع غير متاح");
            break;
        case error.TIMEOUT:
            alert("انتهت مهلة الطلب للحصول على الموقع");
            break;
        default:
            alert("حدث خطأ غير معروف");
    }
}

// دالة لجلب بيانات الطقس بناءً على اسم المدينة
const getWeatherData = async (late, long) => {
    try {
        // بناء عنوان URL لاستدعاء API
        const url = `${BASE_URL}?lat=${late}&lon=${long}&appid=${MAIN_API_KEY}&units=metric`;
        const { data } = await axios.get(url); // جلب البيانات من API
        return formatWeatherData(data); // تنسيق البيانات وإعادتها
    } catch (error) {
        console.error('Error fetching the weather data:', error.message);
        throw new Error('Unable to fetch weather data');
    }
};

// دالة لتنسيق البيانات المسترجعة
const formatWeatherData = (data) => {
    const { name, sys: { country }, main: { temp, humidity }, wind: { speed, gust }, weather } = data; // تفكيك الكائنات
    return {
        city: name,
        country: country,
        temperature: temp,
        wind_speed: speed,
        gusts: gust,
        humidity,
        description: weather[0].description,
    };
};
