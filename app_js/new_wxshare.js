/**
 * Created by ryf on 2017/6/24.
 */
/**
 * 微信统一调用接口
 * 通过meta来获取微信分享的内容
 */
(function() {
    // 获取微信设置信息
    var meta, metas = document.getElementsByTagName('meta');
    for (var i = 0,
             len = metas.length; i < len; i++) {
        if (metas[i].getAttribute('name') == 'sharecontent') {
            meta = metas[i];
        }
    }

    // shareImg = document.getElementById('app-logo').getAttribute('value');
    // 分享给朋友设置
    var link = window.location.href.replace(/www|my/, 'w');

    function loadConfig() {
        var xmlhttp;
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var data = eval('(' + xmlhttp.responseText + ')');

                data = data.data;
                data.debug = false;
                data.jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo','addCard','chooseCard','openCard'];
                //通过config接口注入权限验证配置
                wx.config(data);
                //通过ready接口处理成功验证
                wx.ready(function() {
                    //分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: meta.dataset.lineTitle || document.title + '，敬请访问！',
                        // 分享标题
                        link: link,
                        // 分享链接
                        imgUrl: meta.dataset.lineImg || "http://" + window.location.host + '/images/admin/common/logo.jpg',
                        // 分享图标
                        success: function() {
                            if (meta.dataset.lineCallback) {
                                window.location.href = meta.dataset.lineCallback;
                            }
                        },
                        cancel: function() {
                        }
                    });
                    //分享给朋友
                    wx.onMenuShareAppMessage({
                        title: meta.dataset.msgTitle || document.title,
                        // 分享标题
                        desc: meta.dataset.msgContent || document.title + '，敬请访问！',
                        // 分享描述
                        link: link,
                        // 分享链接
                        imgUrl: meta.dataset.msgImg || "http://" + window.location.host + '/images/admin/common/logo.jpg',
                        // 分享图标
                        type: '',
                        // 分享类型,music、video或link，不填默认为link
                        dataUrl: '',
                        // 如果type是music或video，则要提供数据链接，默认为空
                        success: function() {
                            if (meta.dataset.msgCallback) {
                                window.location.href = meta.dataset.msgCallback;
                            }
                        },
                        cancel: function() {
                        }
                    });

                });
                wx.error(function(res) {
                    //alert(res);
                    //alert("error");
                });
            }
        }
        xmlhttp.open("GET", document.body.getAttribute('data-form-host') + "/open/interface/get_jsconfig?url=" + location.href, true);
        xmlhttp.send();
    }
    loadConfig();
})();