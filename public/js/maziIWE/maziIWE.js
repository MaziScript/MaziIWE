//var masterMessage = "http://mazi.yesterday17.cn/contents/message.php";
//var domain = "http://mazi.yesterday17.cn/admin/"
var masterMessage = "../m.txt";
var domain = "http://localhost/MaziScript/admin/production";
var notloginHref = "login.html";

function loadUserData(pageType) {
    //获取用户名和头像
    if (typeof (Storage) !== "undefined") {
        // Debug:
        localStorage.setItem("loginJson", "{\"userName\":\"yesterday17\",\"userMail\":\"t@yesterday17.cn\",\"nickName\":\"昨日的十七号\",\"iconUrl\":\"http://cn.gravatar.com/avatar/593427ee927677898cd113488488eb33?s=50&d=mm&r=g\"}");
        try {
            //loginCheck:
            var userData = JSON.parse(localStorage.getItem("loginJson"));
            if (userData == null || userHasNull(userData)) {
                //跳转到正常的登录界面
                alert("该用户没有访问该界面的资格，请登录后正常访问！");
                window.location.href = notloginHref;
                return null;
            }
            editPageByType(pageType, userData);
            return userData;
        }
        catch (e) {
            alert("页面加载错误，请正常访问！");
            window.location.href = notloginHref;
            return null;
        }
    }
    else {
        // 读取Cookies
    }
}

function userHasNull(userData) {
    if (userData.userName == null) return true;
    if (userData.userMail == null) return true;
    if (userData.nickName == null) return true;
    if (userData.iconUrl == null) return true;
    //if(userData.timeStamp == null) return true;
    return false;
}

function editPageByType(pageType, userData) {
    if (pageType == "common") {
        //修改用户名
        $("#maziIWE_user_name_1").text(userData.nickName);
        //修改右上角缩略
        $("#maziIWE_user_name_2").html("<img src=\"" + userData.iconUrl + "\" alt=\"\">" + userData.nickName + "<span class=\" fa fa-angle-down'\"></span>");
        /*
            <img src="images/img.jpg" alt="" id="">Undefined<span class=" fa fa-angle-down"></span>
            "<img src=\"" + userData.iconUrl + "\" alt=\"\">" + userData.nickName + "<span class=\" fa fa-angle-down'"></span>"
        */
        //修改用户头像
        $("#maziIWE_user_icon_main").attr('src', userData.iconUrl);
        //用户收到的信息
        try {
            var mess = JSON.parse(masterAjax(masterMessage));
            if (mess.total != null && mess.total > 0) {
                $("#maziIWE_message_num").text(mess.total);
                for (var i in mess.content) {
                    $("#maziIWE_message_list").prepend("<li><a><span class=\"image\"><img src=\"" + mess.content[i].userData.iconUrl + "\" alt=\"Profile Image\" /></span><span><span>" + mess.content[i].userData.nickName + "</span><span class=\"time\">" + mess.content[i].time + "</span></span><span class=\"message\">" + mess.content[i].content + "</span></a></li>");
                }
            }
            else {
                $("#maziIWE_message").hide();
            }
        }
        catch (e) {
            $("#maziIWE_message").hide();
        }
        /*
        <li>
            <a>
            <span class="image"><img src="images/img.jpg" alt="Profile Image" /></span>
            <span>
              <span>John Smith</span>
              <span class="time">3 mins ago</span>
            </span>
            <span class="message">
              Film festivals used to be do-or-die moments for movie makers. They were where...
            </span>
             </a>
        </li>
        
        */
    }
}

function masterAjax(addr) {
    htmlobj = $.ajax({
        url: addr
        , async: false
    });
    return htmlobj.responseText;
}