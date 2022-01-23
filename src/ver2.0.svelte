<script>
    import Read_me from './read_me.svelte'
    import { read_me , y } from "./stores"
    import { pointData } from "./points.js"
    import { quakeScale } from "./quakeScale"
    import { areaName } from "./areaName"
    import { domesticTsunami } from "./domesticTsuname"
    import { epsp_area } from "./epsp-area"
    import { convertColor , change_color_intensity } from "./convertColor"
    import { tsunami_type } from "./tsunami-type"
    import { changeArray } from "./changeArray"
    import { convertScales } from "./convertScales"
    import { confidence } from "./confidence"
    import { city } from "./city"
    import { correct } from "./correct"
    import { scales_for_map } from "./scales-for-map"
    import {LeafletMap, Icon, Marker, TileLayer} from 'svelte-leafletjs';
    import { convertScales_for_past } from "./convertScales_for_past"
    import moment from 'moment';
    import { onMount } from "svelte";

    import { sample2 } from "./example/sample2"
    import { sample3 } from "./example/sample3"


    const get = () => {
        if(Rjson[0].issue.type == "ScalePrompt"){
            counter.ScalePrompt++
        }else if(Rjson[0].issue.type == "Destination"){
            counter.Destination++
        }else if(Rjson[0].issue.type == "ScaleAndDestination"){
            counter.ScaleAndDestination++
        }else if(Rjson[0].issue.type == "DetailScale"){
            counter.ScalePrompt = 0
            counter.Destination = 0
            counter.ScaleAndDestination = 0
        }

        for(let e = 0; e < Rjson.length; e++){
            let info = Rjson[e]
            //各地の震度に関する情報の場合
            if(info.code == 551 && info.issue.type == "DetailScale"){
                //国内での津波の有無を日本語化
                info.earthquake.domesticTsunami_ja = domesticTsunami[info.earthquake.domesticTsunami]
                //最大震度を日本語化
                info.earthquake.maxScale_ja = quakeScale[info.earthquake.maxScale]
                //最大震度
                info.earthquake.maxScale_en = convertScales_for_past[info.earthquake.maxScale]
                for(let i = 0; i < info.points.length; i++){
                    //各地の震度を日本語化
                    info.points[i].scale_changed = quakeScale[info.points[i].scale]
                    //震度観測点の座標を追加
                    //市区町村名、都道府県名を追加
                    for(let o = 0; o < pointData.length; o++){
                        if(pointData[o].name == info.points[i].addr){
                            info.points[i].lat = pointData[o].lat
                            info.points[i].lon = pointData[o].lon
                            info.points[i].city = pointData[o].city.name
                            info.points[i].pref = pointData[o].pref.name
                            break;
                        }
                        //データがない場合の処理
                        if(info.points[i].city == undefined){
                            info.points[i].city = "データなし"
                        }
                        if(info.points[i].pref == undefined){
                            info.poinrs[i].pref = "データなし"
                        }
                    }
                }
                //震度ごとに整理
                info.arrayScale = {}
                info.arrayScale2 = {}
                for(let f = 0; f < 11; f++){
                    info.arrayScale[f] = []
                    info.arrayScale2[f] = []
                    //この際は「都道府県名　市区町村名」で保存
                    for(let i = 0; i < info.points.length; i++){
                        if(info.points[i].scale_changed == convertScales[f]){
                            info.arrayScale[f].push(info.points[i].pref + " " + info.points[i].city)
                        }
                    }
                    //重複を削除
                    info.arrayScale2[f] = Array.from(new Set(info.arrayScale[f]))
                }
                if(e == 0 && counter.Destination !== 0){
                    store_earthquake = {}
                }
                
            //震度速報の場合    
            }else if(info.code == 551 && info.issue.type == "ScalePrompt"){
                //最大震度を日本語化
                info.earthquake.maxScale_ja = quakeScale[info.earthquake.maxScale]
                //国内での津波の有無を日本語化
                info.earthquake.domesticTsunami_ja = domesticTsunami[info.earthquake.domesticTsunami]
                //最大震度
                info.earthquake.maxScale_en = convertScales_for_past[info.earthquake.maxScale]
                for(let i = 0; i < info.points.length; i++){
                    //震度を日本語化
                    info.points[i].scale_changed = quakeScale[info.points[i].scale]
                    for(let o = 0; o < areaName.length; o++){
                        if(areaName[o].area == info.points[i].addr){
                            //震度観測点の座標を追加
                            info.points[i].lat = areaName[o].lat
                            info.points[i].lon = areaName[o].lon
                            break;
                        }
                    }
                }
                //震度ごとに整理
                info.arrayScale = {}
                info.arrayScale2 = {}
                for(let f = 0; f < 11; f++){
                    info.arrayScale[f] = []
                    info.arrayScale2[f] = []
                    //この際は「都道府県名　市区町村名」で保存
                    for(let i = 0; i < info.points.length; i++){
                        if(info.points[i].scale_changed == convertScales[f]){
                            info.arrayScale[f].push(info.points[i].addr)
                        }
                    }
                    //重複を削除
                    info.arrayScale2[f] = Array.from(new Set(info.arrayScale[f]))
                }

                if(e == 0){
                    store_maxScale = Rjson[e].earthquake.maxScale
                }
                if(e == 0 && counter.Destination !== 0){
                    Rjson[e].earthquake = store_earthquake
                    Rjson[e].earthquake.maxScale = store_maxScale
                    //最大震度を日本語化
                    Rjson[e].earthquake.maxScale_ja = quakeScale[Rjson[e].earthquake.maxScale]
                    //最大震度
                    Rjson[e].earthquake.maxScale_en = convertScales_for_past[Rjson[e].earthquake.maxScale]
                }
            //震源に関する情報の場合
            }else if(info.code == 551 && info.issue.type == "Destination"){
                //国内での津波の有無を日本語化
                info.earthquake.domesticTsunami_ja = domesticTsunami[info.earthquake.domesticTsunami]

                if(e == 0){
                    store_earthquake = Rjson[e].earthquake
                }
            //震源・震度に関する情報の場合
            }else if (info.code == 551 && info.issue.type == "ScaleAndDestination"){
                //国内での津波の有無を日本語化
                info.earthquake.domesticTsunami_ja = domesticTsunami[info.earthquake.domesticTsunami]
                //最大震度を日本語化
                info.earthquake.maxScale_ja = quakeScale[info.earthquake.maxScale]
                //最大震度
                info.earthquake.maxScale_en = convertScales_for_past[info.earthquake.maxScale]
                //震度情報が含まれている場合
                if(info.points.length !== 0){
                    for(let i = 0; i < info.points.length; i++){
                        //震度を日本語化
                        info.points[i].scale_changed = quakeScale[info.points[i].scale]
                        if(info.points[i].isArea == true){
                            for(let o = 0; o < areaName.length; o++){
                                //震度観測点の座標を追加
                                if(areaName[o].area == info.points[i].addr){
                                    info.points[i].lat = areaName[o].lat
                                    info.points[i].lon = areaName[o].lon
                                    break;
                                }
                            }
                        }else if(info.points[i].isArea == false ){
                            //震度観測点の座標を追加
                            //市区町村名、都道府県名を追加
                            for(let o = 0; o < city.length; o++){
                                if(city[o].name == info.points[i].addr){
                                    info.points[i].lat = city[o].lat
                                    info.points[i].lon = city[o].lon
                                    break;
                                }
                                //データがない場合の処理
                                if(info.points[i].city == undefined){
                                    info.points[i].city = "データなし"
                                }
                                if(info.points[i].pref == undefined){
                                    info.poinrs[i].pref = "データなし"
                                }
                            }
                        }
                    }
                    //震度ごとに整理
                    info.arrayScale = {}
                    info.arrayScale2 = {}
                    for(let f = 0; f < 11; f++){
                        info.arrayScale[f] = []
                        info.arrayScale2[f] = []
                        //この際は「都道府県名　市区町村名」で保存
                        for(let i = 0; i < info.points.length; i++){
                            if(info.points[i].isArea == true){
                                if(info.points[i].scale_changed == convertScales[f]){
                                    info.arrayScale[f].push(info.points[i].addr)
                                }
                            }else if(info.points[i].isArea == false ){
                                if(info.points[i].scale_changed == convertScales[f]){
                                    info.arrayScale[f].push(info.points[i].addr)
                                }
                            } 
                        }
                        //重複を削除
                        info.arrayScale2[f] = Array.from(new Set(info.arrayScale[f]))
                    }
                }
            }
        }
    }

    //地震感知情報の処理
    const get_userQuake = () => {
        for(let i = 0; i < userQuakeJson.length; i++){
            let conf = userQuakeJson[i].confidence
            userQuakeJson[i].confLevel = {}
            //ObjectをArrayに変換
            userQuakeJson[i].area_conf = Object.entries(userQuakeJson[i].area_confidences)
            //信頼度を日本語化
            if( conf >= 0 && conf < 0.96774 ){
                userQuakeJson[i].confLevel = "レベル0"
            }else if( conf >= 0.96774 && conf < 0.97015 ){
                userQuakeJson[i].confLevel = "レベル1"
            }else if( conf >= 0.97015 && conf < 0.97024){
                userQuakeJson[i].confLevel = "レベル2"
            }else if( conf >= 0.97024 && conf < 0.98052 ){
                userQuakeJson[i].confLevel = "レベル3"
            }else if( conf >= 0.98052 ){
                userQuakeJson[i].confLevel = "レベル4"
            }
            //地域名に変換
            for(let e = 0; e < userQuakeJson[i].area_conf.length; e++){
                let area = userQuakeJson[i].area_conf[e][0]
                userQuakeJson[i].area_conf[e][2] = {}
                for(let x = 0; x < epsp_area.length; x++){
                    if( area == epsp_area[x]["地域コード(数値型)"]){
                        userQuakeJson[i].area_conf[e][2] = epsp_area[x]["地域"]
                    }
                }
            }
        }
    };

    
    let Rjson;
    let lastQuakeJson;
    let userQuakeJson;
    let lastJson;
    let apiHttps;
    let tsunamiJson;
    let log;

    let r;

    let data_for_map;
    let data_for_map2; 

    let mapOptions;

    let options_for_destination;

    let options_for_foreign;
    
    let sumlat = 0;
    let sumlon = 0;
    let noHypocenter;

    let iconOptions;

    let mapChange;

    let counter = {
        ScalePrompt : 0,
        Destination : 0,
        ScaleAndDestination : 0,
    }

    let store_earthquake = {};

    let store_maxScale;



    //APIの取得（初期読み込み時）
    try{
        apiHttps = new XMLHttpRequest();
        apiHttps.open("GET", "https://api.p2pquake.net/v2/history?codes=551&limit=3", false);
        apiHttps.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                console.log("success")
            }else{
                console.log("error")
                setTimeout(window.location.reload(), 3000)
            }
        }
        apiHttps.send();
        log = apiHttps.responseText;
        Rjson = JSON.parse(log);

        

        const lastQuake = new XMLHttpRequest();
        lastQuake.open("GET", "https://api.p2pquake.net/v2/jma/quake?limit=10&quake_type=DetailScale", false);
        lastQuake.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                console.log("success")
            }else{
                console.log("error")
                setTimeout(window.location.reload(), 3000)
            }
        }
        lastQuake.send();
        const lastQuakeLog = lastQuake.responseText;
        lastQuakeJson = JSON.parse(lastQuakeLog);

        const userQuake = new XMLHttpRequest();
        userQuake.open("GET", "https://api.p2pquake.net/v2/history?codes=9611&limit=2", false);
        userQuake.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                console.log("success")
            }else{
                console.log("error")
                setTimeout(window.location.reload(), 3000)
            }
        }
        userQuake.send();
        const userQuakeLog = userQuake.responseText;
        userQuakeJson = JSON.parse(userQuakeLog);

        const tsunami = new XMLHttpRequest();
        tsunami.open("GET", "https://api.p2pquake.net/v2/history?codes=552", false);
        tsunami.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                console.log("success")
            }else{
                console.log("error")
                setTimeout(window.location.reload(), 3000)
            }
        }
        tsunami.send();
        const tsunamiLog = tsunami.responseText;
        tsunamiJson = JSON.parse(tsunamiLog);
    }catch(e){
        setTimeout(window.location.reload(), 3000)
    };

    //処理を実行
    get();
    get_userQuake();


    //はじめのJsonをlastJsonとする
    lastJson = Rjson[0]

    //マップ生成処理
    //その他の情報を排除
    if(Rjson[0].issue.type !== "Other"){
        r = 0
    }else{
        r = 1
    }

    //情報の定義
    data_for_map = Rjson[r]
    data_for_map2 = Rjson[r+1]

    //通常時のマップのセンターと拡大率
    mapOptions = {
        center: [data_for_map.earthquake.hypocenter.latitude, data_for_map.earthquake.hypocenter.longitude],
        zoom: 9,
    };

    //震源情報用
    options_for_destination = {
        center: [data_for_map.earthquake.hypocenter.latitude, data_for_map.earthquake.hypocenter.longitude],
        zoom: 7,
    };

    //海外地震の際のマップのセンターと拡大率
    options_for_foreign = {
        center: [data_for_map.earthquake.hypocenter.latitude, data_for_map.earthquake.hypocenter.longitude],
        zoom: 2,
    }

    //震度情報の際の処理　各地の座標を平均して中央に割り当てる
    if(data_for_map.issue.type == "ScalePrompt"){
        for(let i = 0; i < data_for_map.points.length; i++){
            let replacedLat = data_for_map.points[i].lat
            let replacedLon = data_for_map.points[i].lon
            sumlat += Number(replacedLat)
            sumlon += Number(replacedLon)
        }
        noHypocenter =  {
            center: [sumlat / Number(data_for_map.points.length),sumlon / Number(data_for_map.points.length)],
            zoom: 7,
        }
    }

    //センターアイコンの設定
    iconOptions = {
        iconUrl: '/scale/center.png',
        iconSize: [30, 30],
        iconAnchor:[15,15]
    };

    //マップ変更を司る係数
    mapChange = Rjson[0]


    //繰り返し取得（20秒ごと）（最新の地震情報）
    setInterval(function(){
        try{
            apiHttps = new XMLHttpRequest();
            apiHttps.open("GET", "https://api.p2pquake.net/v2/history?codes=551&limit=3", false);
            apiHttps.send();
            log = apiHttps.responseText;
            Rjson = JSON.parse(log);
        }catch(e){
            console.log(e)
        };

        //処理実行
        get()

        //情報の更新があるとき
        if(JSON.stringify(Rjson[0]) !== JSON.stringify(lastJson)){
            //その他の情報を排除
            if(Rjson[0].issue.type !== "Other"){
                r = 0
            }else{
                r = 1
            }

            //情報の定義
            data_for_map = Rjson[r]
            data_for_map2 = Rjson[r+1]

            //通常時のマップのセンターと拡大率
            mapOptions = {
                center: [data_for_map.earthquake.hypocenter.latitude, data_for_map.earthquake.hypocenter.longitude],
                zoom: 9,
            };

            //震源情報用
            options_for_destination = {
                center: [data_for_map.earthquake.hypocenter.latitude, data_for_map.earthquake.hypocenter.longitude],
                zoom: 7,
            };

            //海外地震の際のマップのセンターと拡大率
            options_for_foreign = {
                center: [data_for_map.earthquake.hypocenter.latitude, data_for_map.earthquake.hypocenter.longitude],
                zoom: 2,
            }

            //共に0に設定
            sumlat = 0;
            sumlon = 0;
            
            //震度情報の際の処理　各地の座標を平均して中央に割り当てる
            if(data_for_map.issue.type == "ScalePrompt"){
                for(let i = 0; i < data_for_map.points.length; i++){
                    if("lat" in data_for_map.points[i] && "lon" in data_for_map.points[i]){
                        let replacedLat = data_for_map.points[i].lat
                        let replacedLon = data_for_map.points[i].lon
                        sumlat += Number(replacedLat)
                        sumlon += Number(replacedLon)     
                    }
                }
                noHypocenter =  {
                    center: [sumlat / Number(data_for_map.points.length), sumlon / Number(data_for_map.points.length)],
                    zoom: 7,
                }
            }

            //センターアイコンの設定
            iconOptions = {
                iconUrl: '/scale/center.png',
                iconSize: [30, 30],
                iconAnchor:[15,15]
            };

            //マップ変更を司る係数
            mapChange = Rjson[0]
        }

        lastJson = Rjson[0]

    },20000);

    //繰り返し取得（60秒ごと）（過去の地震情報）
    setInterval(function(){
        try{
            const lastQuake = new XMLHttpRequest();
            lastQuake.open("GET", "https://api.p2pquake.net/v2/jma/quake?limit=10&quake_type=DetailScale", false);
            lastQuake.send();
            const logQuakes = lastQuake.responseText;
            lastQuakeJson = JSON.parse(logQuakes);
        }catch(e){
            console.log(e)
        };
    },60000);

    //繰り返し取得（30秒ごと）（津波情報）
    setInterval(function(){
        try{
            const tsunami = new XMLHttpRequest();
            tsunami.open("GET", "https://api.p2pquake.net/v2/history?codes=552", false);
            tsunami.send();
            const tsunamiLog = tsunami.responseText;
            tsunamiJson = JSON.parse(tsunamiLog);
        }catch(e){
            console.log(e)
        };
    },30000);

    //繰り返し取得（10秒ごと）（地震感知情報）
    setInterval(function(){
        try{
            const userQuake = new XMLHttpRequest();
            userQuake.open("GET", "https://api.p2pquake.net/v2/history?codes=9611&limit=1", false);
            userQuake.send();
            const userQuakeLog = userQuake.responseText;
            userQuakeJson = JSON.parse(userQuakeLog);
        }catch(e){
            console.log(e)
        };

        //処理実行
        get_userQuake()
    },10000);

    //時間の取得
    let date;
    let nowDate;
    date = moment();
    nowDate = Number(date.format('YYYYMMDDHHmmss.sss'))
    const getDate = () => {
        date = moment();
        nowDate = Number(date.format('YYYYMMDDHHmmss'))
    }
    setInterval(getDate,1000)
    
    //過去の地震情報のはじめの子要素削除
    let changed;
    onMount(() => {
        if(Rjson[0].earthquake.time == lastQuakeJson[0].earthquake.time){
            const RecentQuake = document.getElementById("RecentQuake")
            const firstChild = RecentQuake.firstChild
            firstChild.remove()
            changed = true
        }
        setInterval(function(){
            if(Rjson[0].earthquake.time == lastQuakeJson[0].earthquake.time && changed !== true){
                const RecentQuake = document.getElementById("RecentQuake")
                const firstChild = RecentQuake.firstChild
                firstChild.remove()
            }
        }, 60000)
    })

    //マップのタイルレイヤーの指定
    const tileUrl = "https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png";

    //マップの初期の状態の設定
    const tileLayerOptions = {
        minZoom: 0,
        maxZoom: 20,
        maxNativeZoom: 19,
        attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
    };

    //震源アイコンの設定
    
    
    let leafletMap;

    //モーダル出現処理
    //モーダル出現時にスクロール位置を取得し固定する
    let y_number;
    const open_read_me = () => {
        y_number = "-" + window.scrollY + "px"
        y.set(y_number)
        read_me.set(true)
    }
</script>

<div class="parent" class:modal-open={$read_me} id="scroll" style="--y_value:{y_number};">
    <!--ロゴ部分-->
    <div class="logo contents">
        <div class="logo-inner">observer<br>4375</div>
        <div style="width:40px; height:100%;"></div>
        <div class="github">
            <a href="https://github.com/taro-core2duo/observer-4375" target="_blank">
                <img src="GitHub-Mark-64px.png" alt="github" class="github-img">
            </a>
            <a href="https://github.com/taro-core2duo/observer-4375" class="github-link" target="_blank">
                <p class="github-text">GitHub</p>
            </a>
        </div>
        <div class="read" on:click={open_read_me}>
            <i class="fas fa-book-open fa-2x fa-fw read-icon" ></i>
            <p class="read-text">read</p>
        </div>
    </div>
    <!--地震感知情報部分-->
    <div class="EEW-detection contents">
        <div class="EEW-detection-left contents-left">
            <div class="EEW-detection-left-explanation contents-left-explanation">
                <div class="EEW-detection-left-explanation-ja contents-left-explanation-ja">地震感知情報</div>
                <div class="EEW-detection-left-explanation-en contents-left-explanation-en">earthquake<br>detection</div>
            </div>
        </div>
        <div class="EEW-detection-right contents-right">
            {#if userQuakeJson[0].confidence !== 0 && (moment(nowDate, "YYYYMMDDHHmmss.sss").diff(moment(userQuakeJson[0].updated_at.replace(/\/|:|\s/g,""), "YYYYMMDDHHmmss.sss"), "seconds") <= 300 ) && (moment(nowDate, "YYYYMMDDHHmmss.sss").diff(moment(userQuakeJson[0].updated_at.replace(/\/|:|\s/g,""), "YYYYMMDDHHmmss.sss"), "seconds") >= 0 )}
                <div class="EEW-detection-right-time">{userQuakeJson[0].updated_at}</div>
                <div class="EEW-detection-right-happen">地震発生の可能性</div>
                <div class="EEW-detection-right-area">
                    <span class="EEW-detection-right-area-about">該当地域</span>
                    <span class="EEW-detection-right-area-sapn">
                    {#each confidence as conf}
                        {#each userQuakeJson[0].area_conf as eachArea}
                            {#if eachArea[1].display == conf}
                                {eachArea[2]}{eachArea[1].display}&ensp;
                            {/if}
                        {/each}
                    {/each}
                    </span>
                </div>
            {:else}
            <div class="EEW-detection-right-noninfomation">情報なし</div>
            {/if}
        </div>
    </div>
    <!--最新の地震情報部分-->
    <div class="recent-quake contents">
        <div class="recent-quake-left contents-left">
            <div class="recent-quake-left-explanation contents-left-explanation">
                <div class="recent-quake-left-explanation-ja contents-left-explanation-ja">最新の地震</div>
                <div class="recent-quake-left-explanation-en contents-left-explanation-en">latest<br>earthquake</div>
            </div>
        </div>
        <div class="recent-quake-right contents-right">
            <!--各地の震度に関する情報の時-->
            {#if (Rjson[r].issue.type == "DetailScale")}
            {#if (Rjson[r].issue.correct !== "None")}
            <div class="recent-quake-right-correct">訂正報 {correct[Rjson[r].issue.correct]}に関して</div>
            {/if}
            <div class="recent-quake-right-color-bar recent-quake-right-contents" style="background-color:{change_color_intensity[Rjson[r].earthquake.maxScale][0]}; color:{change_color_intensity[Rjson[r].earthquake.maxScale][1]};">{Rjson[r].earthquake.maxScale_en}</div>
            <div class="recent-quake-right-info recent-quake-right-contents">
                <div class="recent-quake-right-info-time recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-time-title-ja recent-quake-right-info-contents-title-ja">時刻</div>
                    <div class="recent-quake-right-info-time-title-en recent-quake-right-info-contents-title-en">time</div>
                    <div class="recent-quake-right-info-time-time recent-quake-right-info-contents-content">{Rjson[r].earthquake.time}</div>
                </div>
                <div class="recent-quake-right-info-intensity recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-intensity-title-ja recent-quake-right-info-contents-title-ja">最大震度</div>
                    <div class="recent-quake-right-info-intensity-title-en recent-quake-right-info-contents-title-en">max intensity</div>
                    <div class="recent-quake-right-info-intensity-intensity recent-quake-right-info-contents-content">{Rjson[r].earthquake.maxScale_ja}</div>
                </div>
                <div class="recent-quake-right-info-magunitude recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-magunitude-title-ja recent-quake-right-info-contents-title-ja">マグニチュード</div>
                    <div class="recent-quake-right-info-magunitude-title-en recent-quake-right-info-contents-title-en">magunitude</div>
                    <div class="recent-quake-right-info-magunitude-magunitude recent-quake-right-info-contents-content">{Rjson[r].earthquake.hypocenter.magnitude}</div>
                </div>
                <div class="recent-quake-right-info-hypocenter recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-hypocenter-title-ja recent-quake-right-info-contents-title-ja">震源</div>
                    <div class="recent-quake-right-info-hypocenter-title-en recent-quake-right-info-contents-title-en">hypocenter</div>
                    <div class="recent-quake-right-info-hypocenter-hypocenter recent-quake-right-info-contents-content">{Rjson[r].earthquake.hypocenter.name}</div>
                </div>
                <div class="recent-quake-right-info-depth recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-depth-title-ja recent-quake-right-info-contents-title-ja">深さ</div>
                    <div class="recent-quake-right-info-depth-title-en recent-quake-right-info-contents-title-en">depth of the hypocenter</div>
                    {#if Rjson[r].earthquake.hypocenter.depth !== 0}
                    <div class="recent-quake-right-info-depth-depth recent-quake-right-info-contents-content">約{Rjson[r].earthquake.hypocenter.depth}km</div>
                    {:else}
                    <div class="recent-quake-right-info-depth-depth recent-quake-right-info-contents-content">ごく浅い</div>
                    {/if}
                </div>
                <div class="recent-quake-right-info-tsunami recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-tsunami-title-ja recent-quake-right-info-contents-title-ja">津波</div>
                    <div class="recent-quake-right-info-tsunami-title-en recent-quake-right-info-contents-title-en">possibility of tsunami</div>
                    <div class="recent-quake-right-info-tsunami-tsunami recent-quake-right-info-contents-content">{Rjson[r].earthquake.domesticTsunami_ja}</div>
                </div>
                <div class="recent-quake-right-info-area recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-area-title-ja recent-quake-right-info-contents-title-ja">各地の震度</div>
                    <div class="recent-quake-right-info-area-title-en recent-quake-right-info-contents-title-en">intensity in each area</div>
                    <div class="recent-quake-right-info-area-area recent-quake-right-info-contents-content">
                        {#each changeArray as change}
                        {#if Rjson[r].arrayScale2[change].length > 0}
                        <div class="recent-quake-right-info-area-area-intencity" style="border-bottom:2px solid {convertColor[change][0]};">震度{convertScales[change]}</div>
                        {#each Rjson[r].arrayScale2[change] as location}
                        <div class="recent-quake-right-info-area-area-name">{location}</div>
                        {/each}
                        {/if}
                        {/each}
                    </div>
                </div>
            </div>
            <!--震源情報以降の震度速報時-->
            {:else if (Rjson[r].issue.type == "ScalePrompt" && counter.Destination !== 0)}
            {#if (Rjson[r].issue.correct !== "None")}
            <div class="recent-quake-right-correct">訂正報 {correct[Rjson[r].issue.correct]}に関して</div>
            {/if}
            <div class="recent-quake-right-color-bar recent-quake-right-contents" style="background-color:{change_color_intensity[Rjson[r].earthquake.maxScale][0]}; color:{change_color_intensity[Rjson[r].earthquake.maxScale][1]};">{Rjson[r].earthquake.maxScale_en}</div>
            <div class="recent-quake-right-info recent-quake-right-contents">
                <div class="recent-quake-right-info-time recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-time-title-ja recent-quake-right-info-contents-title-ja">時刻</div>
                    <div class="recent-quake-right-info-time-title-en recent-quake-right-info-contents-title-en">time</div>
                    <div class="recent-quake-right-info-time-time recent-quake-right-info-contents-content">{Rjson[r].earthquake.time}</div>
                </div>
                <div class="recent-quake-right-info-intensity recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-intensity-title-ja recent-quake-right-info-contents-title-ja">最大震度</div>
                    <div class="recent-quake-right-info-intensity-title-en recent-quake-right-info-contents-title-en">max intensity</div>
                    <div class="recent-quake-right-info-intensity-intensity recent-quake-right-info-contents-content">{Rjson[r].earthquake.maxScale_ja}</div>
                </div>
                <div class="recent-quake-right-info-magunitude recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-magunitude-title-ja recent-quake-right-info-contents-title-ja">マグニチュード</div>
                    <div class="recent-quake-right-info-magunitude-title-en recent-quake-right-info-contents-title-en">magunitude</div>
                    <div class="recent-quake-right-info-magunitude-magunitude recent-quake-right-info-contents-content">{Rjson[r].earthquake.hypocenter.magnitude}</div>
                </div>
                <div class="recent-quake-right-info-hypocenter recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-hypocenter-title-ja recent-quake-right-info-contents-title-ja">震源</div>
                    <div class="recent-quake-right-info-hypocenter-title-en recent-quake-right-info-contents-title-en">hypocenter</div>
                    <div class="recent-quake-right-info-hypocenter-hypocenter recent-quake-right-info-contents-content">{Rjson[r].earthquake.hypocenter.name}</div>
                </div>
                <div class="recent-quake-right-info-depth recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-depth-title-ja recent-quake-right-info-contents-title-ja">深さ</div>
                    <div class="recent-quake-right-info-depth-title-en recent-quake-right-info-contents-title-en">depth of the hypocenter</div>
                    {#if Rjson[r].earthquake.hypocenter.depth !== 0}
                    <div class="recent-quake-right-info-depth-depth recent-quake-right-info-contents-content">約{Rjson[r].earthquake.hypocenter.depth}km</div>
                    {:else}
                    <div class="recent-quake-right-info-depth-depth recent-quake-right-info-contents-content">ごく浅い</div>
                    {/if}
                </div>
                <div class="recent-quake-right-info-tsunami recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-tsunami-title-ja recent-quake-right-info-contents-title-ja">津波</div>
                    <div class="recent-quake-right-info-tsunami-title-en recent-quake-right-info-contents-title-en">possibility of tsunami</div>
                    <div class="recent-quake-right-info-tsunami-tsunami recent-quake-right-info-contents-content">{Rjson[r].earthquake.domesticTsunami_ja}</div>
                </div>
                <div class="recent-quake-right-info-area recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-area-title-ja recent-quake-right-info-contents-title-ja">各地の震度</div>
                    <div class="recent-quake-right-info-area-title-en recent-quake-right-info-contents-title-en">intensity in each area</div>
                    <div class="recent-quake-right-info-area-area recent-quake-right-info-contents-content">
                        {#each changeArray as change}
                        {#if Rjson[r].arrayScale2[change].length > 0}
                        <div class="recent-quake-right-info-area-area-intencity" style="border-bottom:2px solid {convertColor[change][0]};">震度{convertScales[change]}</div>
                        {#each Rjson[r].arrayScale2[change] as location}
                        <div class="recent-quake-right-info-area-area-name">{location}</div>
                        {/each}
                        {/if}
                        {/each}
                    </div>
                </div>
            </div>
            <!--震源に関する情報の時-->
            {:else if (Rjson[r].issue.type == "Destination")}
            {#if (Rjson[r].issue.correct !== "None")}
            <div class="recent-quake-right-correct">訂正報 {correct[Rjson[r].issue.correct]}に関して</div>
            {/if}
            <div class="recent-quake-right-color-bar recent-quake-right-contents" style="background-color:{change_color_intensity[Rjson[r+1].earthquake.maxScale][0]}; color:{change_color_intensity[Rjson[r+1].earthquake.maxScale][1]};">{Rjson[r+1].earthquake.maxScale_en}</div>
            <div class="recent-quake-right-info recent-quake-right-contents">
                <div class="recent-quake-right-info-time recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-time-title-ja recent-quake-right-info-contents-title-ja">時刻</div>
                    <div class="recent-quake-right-info-time-title-en recent-quake-right-info-contents-title-en">time</div>
                    <div class="recent-quake-right-info-time-time recent-quake-right-info-contents-content">{Rjson[r].earthquake.time}</div>
                </div>
                <div class="recent-quake-right-info-intensity recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-intensity-title-ja recent-quake-right-info-contents-title-ja">最大震度</div>
                    <div class="recent-quake-right-info-intensity-title-en recent-quake-right-info-contents-title-en">max intensity</div>
                    <div class="recent-quake-right-info-intensity-intensity recent-quake-right-info-contents-content">{Rjson[r+1].earthquake.maxScale_ja}</div>
                </div>
                <div class="recent-quake-right-info-magunitude recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-magunitude-title-ja recent-quake-right-info-contents-title-ja">マグニチュード</div>
                    <div class="recent-quake-right-info-magunitude-title-en recent-quake-right-info-contents-title-en">magunitude</div>
                    <div class="recent-quake-right-info-magunitude-magunitude recent-quake-right-info-contents-content">{Rjson[r].earthquake.hypocenter.magnitude}</div>
                </div>
                <div class="recent-quake-right-info-hypocenter recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-hypocenter-title-ja recent-quake-right-info-contents-title-ja">震源</div>
                    <div class="recent-quake-right-info-hypocenter-title-en recent-quake-right-info-contents-title-en">hypocenter</div>
                    <div class="recent-quake-right-info-hypocenter-hypocenter recent-quake-right-info-contents-content">{Rjson[r].earthquake.hypocenter.name}</div>
                </div>
                <div class="recent-quake-right-info-depth recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-depth-title-ja recent-quake-right-info-contents-title-ja">深さ</div>
                    <div class="recent-quake-right-info-depth-title-en recent-quake-right-info-contents-title-en">depth of the hypocenter</div>
                    {#if Rjson[r].earthquake.hypocenter.depth !== 0}
                    <div class="recent-quake-right-info-depth-depth recent-quake-right-info-contents-content">約{Rjson[r].earthquake.hypocenter.depth}km</div>
                    {:else}
                    <div class="recent-quake-right-info-depth-depth recent-quake-right-info-contents-content">ごく浅い</div>
                    {/if}
                </div>
                <div class="recent-quake-right-info-tsunami recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-tsunami-title-ja recent-quake-right-info-contents-title-ja">津波</div>
                    <div class="recent-quake-right-info-tsunami-title-en recent-quake-right-info-contents-title-en">possibility of tsunami</div>
                    <div class="recent-quake-right-info-tsunami-tsunami recent-quake-right-info-contents-content">{Rjson[r].earthquake.domesticTsunami_ja}</div>
                </div>
                <div class="recent-quake-right-info-area recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-area-title-ja recent-quake-right-info-contents-title-ja">各地の震度</div>
                    <div class="recent-quake-right-info-area-title-en recent-quake-right-info-contents-title-en">intensity in each area</div>
                    <div class="recent-quake-right-info-area-area recent-quake-right-info-contents-content">
                        {#each changeArray as change}
                        {#if Rjson[r+1].arrayScale2[change].length > 0}
                        <div class="recent-quake-right-info-area-area-intencity" style="border-bottom:2px solid {convertColor[change][0]};">震度{convertScales[change]}</div>
                        {#each Rjson[r+1].arrayScale2[change] as location}
                        <div class="recent-quake-right-info-area-area-name">{location}</div>
                        {/each}
                        {/if}
                        {/each}
                    </div>
                </div>
            </div>
            <!--震度速報の時-->
            {:else if (Rjson[r].issue.type == "ScalePrompt")}
            {#if (Rjson[r].issue.correct !== "None")}
            <div class="recent-quake-right-correct">訂正報 {correct[Rjson[r].issue.correct]}に関して</div>
            {/if}
            <div class="recent-quake-right-color-bar recent-quake-right-contents" style="background-color:{change_color_intensity[Rjson[r].earthquake.maxScale][0]}; color:{change_color_intensity[Rjson[r].earthquake.maxScale][1]};">{Rjson[r].earthquake.maxScale_en}</div>
            <div class="recent-quake-right-info recent-quake-right-contents">
                <div class="recent-quake-right-info-time recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-time-title-ja recent-quake-right-info-contents-title-ja">時刻</div>
                    <div class="recent-quake-right-info-time-title-en recent-quake-right-info-contents-title-en">time</div>
                    <div class="recent-quake-right-info-time-time recent-quake-right-info-contents-content">{Rjson[r].earthquake.time}</div>
                </div>
                <div class="recent-quake-right-info-intensity recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-intensity-title-ja recent-quake-right-info-contents-title-ja">最大震度</div>
                    <div class="recent-quake-right-info-intensity-title-en recent-quake-right-info-contents-title-en">max intensity</div>
                    <div class="recent-quake-right-info-intensity-intensity recent-quake-right-info-contents-content">{Rjson[r].earthquake.maxScale_ja}</div>
                </div>
                <div class="recent-quake-right-info-magunitude recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-magunitude-title-ja recent-quake-right-info-contents-title-ja">マグニチュード</div>
                    <div class="recent-quake-right-info-magunitude-title-en recent-quake-right-info-contents-title-en">magunitude</div>
                    <div class="recent-quake-right-info-magunitude-magunitude recent-quake-right-info-contents-content">調査中</div>
                </div>
                <div class="recent-quake-right-info-hypocenter recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-hypocenter-title-ja recent-quake-right-info-contents-title-ja">震源</div>
                    <div class="recent-quake-right-info-hypocenter-title-en recent-quake-right-info-contents-title-en">hypocenter</div>
                    <div class="recent-quake-right-info-hypocenter-hypocenter recent-quake-right-info-contents-content">調査中</div>
                </div>
                <div class="recent-quake-right-info-depth recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-depth-title-ja recent-quake-right-info-contents-title-ja">深さ</div>
                    <div class="recent-quake-right-info-depth-title-en recent-quake-right-info-contents-title-en">depth of the hypocenter</div>
                    <div class="recent-quake-right-info-depth-depth recent-quake-right-info-contents-content">調査中</div>
                </div>
                <div class="recent-quake-right-info-tsunami recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-tsunami-title-ja recent-quake-right-info-contents-title-ja">津波</div>
                    <div class="recent-quake-right-info-tsunami-title-en recent-quake-right-info-contents-title-en">possibility of tsunami</div>
                    <div class="recent-quake-right-info-tsunami-tsunami recent-quake-right-info-contents-content">{Rjson[r].earthquake.domesticTsunami_ja}</div>
                </div>
                <div class="recent-quake-right-info-area recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-area-title-ja recent-quake-right-info-contents-title-ja">各地の震度</div>
                    <div class="recent-quake-right-info-area-title-en recent-quake-right-info-contents-title-en">intensity in each area</div>
                    <div class="recent-quake-right-info-area-area recent-quake-right-info-contents-content">
                        {#each changeArray as change}
                        {#if Rjson[r].arrayScale2[change].length > 0}
                        <div class="recent-quake-right-info-area-area-intencity" style="border-bottom:2px solid {convertColor[change][0]};">震度{convertScales[change]}</div>
                        {#each Rjson[r].arrayScale2[change] as location}
                        <div class="recent-quake-right-info-area-area-name">{location}</div>
                        {/each}
                        {/if}
                        {/each}
                    </div>
                </div>
            </div>
            <!--震源・震度に関する情報の時-->
            {:else if (Rjson[r].issue.type == "ScaleAndDestination")}
            {#if (Rjson[r].issue.correct !== "None")}
            <div class="recent-quake-right-correct">訂正報 {correct[Rjson[r].issue.correct]}に関して</div>
            {/if}
            <div class="recent-quake-right-color-bar recent-quake-right-contents" style="background-color:{change_color_intensity[Rjson[r].earthquake.maxScale][0]}; color:{change_color_intensity[Rjson[r].earthquake.maxScale][1]};">{Rjson[r].earthquake.maxScale_en}</div>
            <div class="recent-quake-right-info recent-quake-right-contents">
                <div class="recent-quake-right-info-time recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-time-title-ja recent-quake-right-info-contents-title-ja">時刻</div>
                    <div class="recent-quake-right-info-time-title-en recent-quake-right-info-contents-title-en">time</div>
                    <div class="recent-quake-right-info-time-time recent-quake-right-info-contents-content">{Rjson[r].earthquake.time}</div>
                </div>
                <div class="recent-quake-right-info-intensity recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-intensity-title-ja recent-quake-right-info-contents-title-ja">最大震度</div>
                    <div class="recent-quake-right-info-intensity-title-en recent-quake-right-info-contents-title-en">max intensity</div>
                    <div class="recent-quake-right-info-intensity-intensity recent-quake-right-info-contents-content">{Rjson[r].earthquake.maxScale_ja}</div>
                </div>
                <div class="recent-quake-right-info-magunitude recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-magunitude-title-ja recent-quake-right-info-contents-title-ja">マグニチュード</div>
                    <div class="recent-quake-right-info-magunitude-title-en recent-quake-right-info-contents-title-en">magunitude</div>
                    <div class="recent-quake-right-info-magunitude-magunitude recent-quake-right-info-contents-content">{Rjson[r].earthquake.hypocenter.magnitude}</div>
                </div>
                <div class="recent-quake-right-info-hypocenter recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-hypocenter-title-ja recent-quake-right-info-contents-title-ja">震源</div>
                    <div class="recent-quake-right-info-hypocenter-title-en recent-quake-right-info-contents-title-en">hypocenter</div>
                    <div class="recent-quake-right-info-hypocenter-hypocenter recent-quake-right-info-contents-content">{Rjson[r].earthquake.hypocenter.name}</div>
                </div>
                <div class="recent-quake-right-info-depth recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-depth-title-ja recent-quake-right-info-contents-title-ja">深さ</div>
                    <div class="recent-quake-right-info-depth-title-en recent-quake-right-info-contents-title-en">depth of the hypocenter</div>
                    {#if Rjson[r].earthquake.hypocenter.depth !== 0}
                    <div class="recent-quake-right-info-depth-depth recent-quake-right-info-contents-content">約{Rjson[r].earthquake.hypocenter.depth}km</div>
                    {:else}
                    <div class="recent-quake-right-info-depth-depth recent-quake-right-info-contents-content">ごく浅い</div>
                    {/if}
                </div>
                <div class="recent-quake-right-info-tsunami recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-tsunami-title-ja recent-quake-right-info-contents-title-ja">津波</div>
                    <div class="recent-quake-right-info-tsunami-title-en recent-quake-right-info-contents-title-en">possibility of tsunami</div>
                    <div class="recent-quake-right-info-tsunami-tsunami recent-quake-right-info-contents-content">{Rjson[r].earthquake.domesticTsunami_ja}</div>
                </div>
                <div class="recent-quake-right-info-area recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-area-title-ja recent-quake-right-info-contents-title-ja">各地の震度</div>
                    <div class="recent-quake-right-info-area-title-en recent-quake-right-info-contents-title-en">intensity in each area</div>
                    <div class="recent-quake-right-info-area-area recent-quake-right-info-contents-content">
                        {#each changeArray as change}
                        {#if Rjson[r+1].arrayScale2[change].length > 0}
                        <div class="recent-quake-right-info-area-area-intencity" style="border-bottom:2px solid {convertColor[change][0]};">震度{convertScales[change]}</div>
                        {#each Rjson[r+1].arrayScale2[change] as location}
                        <div class="recent-quake-right-info-area-area-name">{location}</div>
                        {/each}
                        {/if}
                        {/each}
                    </div>
                </div>
            </div>
            <!--遠地地震に関する情報の時-->
            {:else if (Rjson[r].issue.type == "Foreign")}
            {#if (Rjson[r].issue.correct !== "None")}
            <div class="recent-quake-right-correct">訂正報 {correct[Rjson[r].issue.correct]}に関して</div>
            {/if}
            <div class="recent-quake-right-color-bar recent-quake-right-contents" style="font-size:26px;margin-top:5px;">海外地震情報</div>
            <div class="recent-quake-right-info recent-quake-right-contents">
                <div class="recent-quake-right-info-time recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-time-title-ja recent-quake-right-info-contents-title-ja">時刻</div>
                    <div class="recent-quake-right-info-time-title-en recent-quake-right-info-contents-title-en">time</div>
                    <div class="recent-quake-right-info-time-time recent-quake-right-info-contents-content">{Rjson[r].earthquake.time}</div>
                </div>
                <div class="recent-quake-right-info-intensity recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-intensity-title-ja recent-quake-right-info-contents-title-ja">最大震度</div>
                    <div class="recent-quake-right-info-intensity-title-en recent-quake-right-info-contents-title-en">max intensity</div>
                    <div class="recent-quake-right-info-intensity-intensity recent-quake-right-info-contents-content">不明</div>
                </div>
                <div class="recent-quake-right-info-magunitude recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-magunitude-title-ja recent-quake-right-info-contents-title-ja">マグニチュード</div>
                    <div class="recent-quake-right-info-magunitude-title-en recent-quake-right-info-contents-title-en">magunitude</div>
                    {#if Rjson[r].earthquake.hypocenter.magnitude == -1}
                    <div class="recent-quake-right-info-magunitude-magunitude recent-quake-right-info-contents-content">不明</div>
                    {:else}
                    <div class="recent-quake-right-info-magunitude-magunitude recent-quake-right-info-contents-content">{Rjson[r].earthquake.hypocenter.magnitude}</div>
                    {/if}
                </div>
                <div class="recent-quake-right-info-hypocenter recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-hypocenter-title-ja recent-quake-right-info-contents-title-ja">震源</div>
                    <div class="recent-quake-right-info-hypocenter-title-en recent-quake-right-info-contents-title-en">hypocenter</div>
                    <div class="recent-quake-right-info-hypocenter-hypocenter recent-quake-right-info-contents-content">{Rjson[r].earthquake.hypocenter.name}</div>
                </div>
                <div class="recent-quake-right-info-depth recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-depth-title-ja recent-quake-right-info-contents-title-ja">深さ</div>
                    <div class="recent-quake-right-info-depth-title-en recent-quake-right-info-contents-title-en">depth of the hypocenter</div>
                    <div class="recent-quake-right-info-depth-depth recent-quake-right-info-contents-content">不明</div>
                </div>
                <div class="recent-quake-right-info-tsunami recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-tsunami-title-ja recent-quake-right-info-contents-title-ja">津波</div>
                    <div class="recent-quake-right-info-tsunami-title-en recent-quake-right-info-contents-title-en">possibility of tsunami</div>
                    <div class="recent-quake-right-info-tsunami-tsunami recent-quake-right-info-contents-content">{Rjson[r].earthquake.domesticTsunami_ja}</div>
                </div>
                <div class="recent-quake-right-info-area recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-area-title-ja recent-quake-right-info-contents-title-ja">各地の震度</div>
                    <div class="recent-quake-right-info-area-title-en recent-quake-right-info-contents-title-en">intensity in each area</div>
                    <div class="recent-quake-right-info-area-area recent-quake-right-info-contents-content">不明</div>
                </div>
            </div>
            {/if}
        </div>
    </div>
    <!--震度分布図部分-->
    <div class="distribution contents">
        <div class="distribution-left contents-left">
            <div class="distribution-left-explanation contents-left-explanation">
                <div class="distribution-left-explanation-ja contents-left-explanation-ja">震度分布</div>
                <div class="distribution-left-explanation-en contents-left-explanation-en">latest<br>earthquake's<br>intensity<br>distribution</div>
            </div>
        </div>
        <div class="distribution-right contents-right">
            {#key mapChange}
            <div class="distribution-right-map">
                <!--各地の震度に関する情報の時-->
                {#if data_for_map.issue.type == "DetailScale"}
                <LeafletMap bind:this={leafletMap} options={mapOptions}>
                    <TileLayer url={tileUrl} options={tileLayerOptions}/>
                    {#each data_for_map.points as point}
                        {#each scales_for_map as scales}
                            {#if point.scale == scales[0]}
                            {#if "lat" in point && "lon" in point}
                                <Marker latLng={[point.lat, point.lon]} zIndexOffset={scales[2]}>
                                    <Icon options={scales[1]}/>
                                </Marker>
                            {/if}
                            {/if}
                        {/each}
                    {/each}
                    {#if "latitude" in data_for_map.earthquake.hypocenter && "longitude" in data_for_map.earthquake.hypocenter}
                        <Marker latLng={[data_for_map.earthquake.hypocenter.latitude, data_for_map.earthquake.hypocenter.longitude]} zIndexOffset={5000}>
                            <Icon options={iconOptions}/>
                        </Marker>
                    {/if}
                </LeafletMap>
                <!--震源に関する情報の時-->
                {:else if data_for_map.issue.type == "Destination"}
                <LeafletMap bind:this={leafletMap} options={options_for_destination}>
                    <TileLayer url={tileUrl} options={tileLayerOptions}/>
                    {#each data_for_map2.points as point}
                        {#each scales_for_map as scales}
                            {#if point.scale == scales[0]}
                            {#if "lat" in point && "lon" in point}
                                <Marker latLng={[point.lat, point.lon]} zIndexOffset={scales[2]}>
                                    <Icon options={scales[1]}/>
                                </Marker>
                            {/if}
                            {/if}
                        {/each}
                    {/each}
                    {#if "latitude" in data_for_map.earthquake.hypocenter && "longitude" in data_for_map.earthquake.hypocenter}
                    <Marker latLng={[data_for_map.earthquake.hypocenter.latitude, data_for_map.earthquake.hypocenter.longitude]} zIndexOffset={5000}>
                        <Icon options={iconOptions}/>
                    </Marker>
                    {/if}
                </LeafletMap>
                <!--震源情報以降の震度速報時-->
                {:else if (Rjson[r].issue.type == "ScalePrompt" && counter.Destination !== 0)}
                <LeafletMap bind:this={leafletMap} options={options_for_destination}>
                    <TileLayer url={tileUrl} options={tileLayerOptions}/>
                    {#each data_for_map.points as point}
                        {#each scales_for_map as scales}
                            {#if point.scale == scales[0]}
                            {#if "lat" in point && "lon" in point}
                                <Marker latLng={[point.lat, point.lon]} zIndexOffset={scales[2]}>
                                    <Icon options={scales[1]}/>
                                </Marker>
                            {/if}
                            {/if}
                        {/each}
                    {/each}
                    {#if "latitude" in data_for_map.earthquake.hypocenter && "longitude" in data_for_map.earthquake.hypocenter}
                        <Marker latLng={[data_for_map.earthquake.hypocenter.latitude, data_for_map.earthquake.hypocenter.longitude]} zIndexOffset={5000}>
                            <Icon options={iconOptions}/>
                        </Marker>
                    {/if}
                </LeafletMap>
                <!--震度速報の時-->
                {:else if data_for_map.issue.type == "ScalePrompt"}
                <LeafletMap bind:this={leafletMap} options={noHypocenter}>
                    <TileLayer url={tileUrl} options={tileLayerOptions}/>
                    {#each data_for_map.points as point}
                        {#each scales_for_map as scales}
                            {#if point.scale == scales[0]}
                            {#if "lat" in point && "lon" in point}
                                <Marker latLng={[point.lat, point.lon]} zIndexOffset={scales[2]}>
                                    <Icon options={scales[1]}/>
                                </Marker>
                            {/if}
                            {/if}
                        {/each}
                    {/each}
                </LeafletMap>
                <!--震源・震度に関する情報の時-->
                {:else if data_for_map.issue.type == "ScaleAndDestination"}
                    {#if data_for_map.points.length !== 0}
                    <LeafletMap bind:this={leafletMap} options={mapOptions}>
                        <TileLayer url={tileUrl} options={tileLayerOptions}/>
                        {#each data_for_map.points as point}
                            {#each scales_for_map as scales}
                                {#if point.scale == scales[0]}
                                {#if "lat" in point && "lon" in point}
                                    <Marker latLng={[point.lat, point.lon]} zIndexOffset={scales[2]}>
                                        <Icon options={scales[1]}/>
                                    </Marker>
                                {/if}
                                {/if}
                            {/each}
                        {/each}
                        {#if "latitude" in data_for_map.earthquake.hypocenter && "longitude" in data_for_map.earthquake.hypocenter}
                        <Marker latLng={[data_for_map.earthquake.hypocenter.latitude, data_for_map.earthquake.hypocenter.longitude]} zIndexOffset={5000}>
                            <Icon options={iconOptions}/>
                        </Marker>
                        {/if}
                    </LeafletMap>
                    {:else}
                    <LeafletMap bind:this={leafletMap} options={mapOptions}>
                        <TileLayer url={tileUrl} options={tileLayerOptions}/>
                        {#each data_for_map2.points as point}
                            {#each scales_for_map as scales}
                                {#if point.scale == scales[0]}
                                {#if "lat" in point && "lon" in point}
                                    <Marker latLng={[point.lat, point.lon]} zIndexOffset={scales[2]}>
                                        <Icon options={scales[1]}/>
                                    </Marker>
                                {/if}
                                {/if}
                            {/each}
                        {/each}
                        {#if "latitude" in data_for_map.earthquake.hypocenter && "longitude" in data_for_map.earthquake.hypocenter}
                        <Marker latLng={[data_for_map.earthquake.hypocenter.latitude, data_for_map.earthquake.hypocenter.longitude]} zIndexOffset={5000}>
                            <Icon options={iconOptions}/>
                        </Marker>
                        {/if}
                    </LeafletMap>
                    {/if}
                <!--遠地地震に関する情報の時-->
                {:else if data_for_map.issue.type == "Foreign"}
                    <LeafletMap bind:this={leafletMap} options={options_for_foreign}>
                        <TileLayer url={tileUrl} options={tileLayerOptions}/>
                            <Marker latLng={[data_for_map.earthquake.hypocenter.latitude, data_for_map.earthquake.hypocenter.longitude]} zIndexOffset={5000}>
                                <Icon options={iconOptions}/>
                            </Marker>
                    </LeafletMap>
                {/if}
            </div>
            {/key}
        </div>
    </div>
    <!--過去の地震情報部分-->
    <div class="past-quake contents">
        <div class="past-quake-left contents-left">
            <div class="past-quake-left-explanation contents-left-explanation">
                <div class="past-quake-left-explanation-ja contents-left-explanation-ja">過去の地震</div>
                <div class="past-quake-left-explanation-en contents-left-explanation-en">past<br>earthquake</div>
            </div>
        </div>
        <div class="past-quake-right contents-right" id="RecentQuake">
            {#each lastQuakeJson as recentQuake}
            <div class="past-quake-right-each-info">
                <div class="past-quake-right-each-info1">
                    <div class="past-quake-right-each-info1-time">{recentQuake.earthquake.time}</div>
                    <div class="past-quake-right-each-info1-hypocenter">{recentQuake.earthquake.hypocenter.name}</div>
                </div>
                <div class="past-quake-right-each-info2">
                    <div class="past-quake-right-each-info2-magunitude"><span style="font-size:20px;">M</span>{recentQuake.earthquake.hypocenter.magnitude}</div>
                </div>
                <div class="past-quake-right-each-info3">
                    <div class="past-quake-right-each-info3-inner" style="background-color:{change_color_intensity[recentQuake.earthquake.maxScale][0]}; color:{change_color_intensity[recentQuake.earthquake.maxScale][1]};">{convertScales_for_past[recentQuake.earthquake.maxScale]}</div>
                </div>                
            </div>
            {/each}
        </div>
    </div>
    <!--津波情報部分-->
    <div class="tsunami contents">
        <div class="tsunami-left contents-left">
            <div class="tsunami-left-explanation contents-left-explanation">
                <div class="tsunami-left-explanation-ja contents-left-explanation-ja">津波情報</div>
                <div class="tsunami-left-explanation-en contents-left-explanation-en">information of<br>tsunami</div>
            </div>
        </div>
        <div class="tsunami-right contents-right">
            {#if tsunamiJson.length == 0 }
            <div class="tsunami-right-noTsunami">津波情報無し</div>
            {:else}
            {#each tsunamiJson as tsunami}
            <div class="tsunami-right-info" id="tsunami">
                <div class="tsunami-right-info-time recent-quake-right-info-contents">
                    <div class="tsunami-right-info-time-title-ja recent-quake-right-info-contents-title-ja">時刻</div>
                    <div class="tsunami-right-info-time-title-en recent-quake-right-info-contents-title-en">time</div>
                    <div class="tsunami-right-info-time-time recent-quake-right-info-contents-content">{tsunami.issue.time}</div>
                </div>
                <div class="tunami-right-info-detail recent-quake-right-info-contents">
                    <div class="tunami-right-info-detail-title-ja recent-quake-right-info-contents-title-ja">発令/キャンセル</div>
                    <div class="tunami-right-info-detail-title-en recent-quake-right-info-contents-title-en">issued or cancelled</div>
                    {#if tsunami.cancelled == false}
                    <div class="tunami-right-info-detail-issued recent-quake-right-info-contents-content">発令</div>
                    {#each tsunami.areas as areas}
                    <div class="tunami-right-info-detail-areas">
                        <div class="tunami-right-info-detail-areas-type" style="border-left:5px solid {tsunami_type[areas.grade][1]}">{tsunami_type[areas.grade][0]}</div>
                        <div class="tunami-right-info-detail-areas-detail">
                            <div class="tunami-right-info-detail-areas-detail-area">{areas.name}</div>
                            {#if areas.immediate == true}
                            <div class="tunami-right-info-detail-areas-detail-come">直ちに来襲</div>
                            {:else if areas.immediate == false}
                            <div class="tunami-right-info-detail-areas-detail-come">直ちに来襲せず</div>
                            {/if}
                        </div>
                    </div>
                    {/each}
                    {:else if tsunami.cancelled == true}
                    <div class="tunami-right-info-detail-issued recent-quake-right-info-contents-content">解除</div>
                    {/if}
                </div>
            </div>
            {/each}
            {/if}
        </div>
    </div>
</div>



<!--readme出現処理-->
{#if $read_me}
<Read_me/>
{/if}



<style>
    .parent{
        width:calc(100vw - 20px);
        height:calc(100vh - 20px);
        padding:10px;
        display:grid;
        grid-template-rows: 15% 55% 30%;
        grid-template-columns: 40% 10% 50%;
    }
    @media (max-width: 930px){
        .parent{
            height:calc(200vh - 20px);
            width:calc(100vw - 32px);
            grid-template-rows: 7.5% 7.5% 30% 25% 15% 15%;
            grid-template-columns: 90%;
        }   
    }
    @media (max-width: 768px){
        .parent{
            height:calc(230vh - 20px);
            width:calc(100vw - 32px);
            grid-template-rows: 7.5% 7.5% 30% 15% 15% 25%;
            grid-template-columns: 90%;
        }   
    }
    .modal-open{
        position:fixed;
        top: var(--y_value);
        left:0;
    }
    .logo{
        grid-area:1/1/2/2;
        display:flex;
        justify-content: space-between;
        align-items: center;
    }
    @media (max-width: 930px){
        .logo{
            grid-area:1/1/2/2;
        } 
    }
    @media (max-width: 768px){
        .logo{
            grid-area:1/1/2/2;
        } 
    }
    @media (max-width: 640px){
        .parent{
            display:block;
        }
    }
    .logo-inner{
        font-size:40px;
        text-align:left;
        margin-left:20px;
    }
    @media (max-width: 640px){
        .logo-inner{
            margin-left:0px;
        }
    }
    .github{
        display:flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    .github-img{
        width:28px;
        height:28px;
    }
    .github-link{
        text-decoration: none;
        color:#000000
    }
    .github-link:visited{
        color:#000000;
    }
    .github-text{
        font-size:12px;
    }
    .read{
        display:flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    .read-icon{

    }
    .read-text{
        font-size:12px;
    }
    .EEW-detection{
        grid-area:1/2/2/4;
        display:grid;
        grid-template-columns: 160px;
        position: relative;
    }
    @media (max-width: 1024px){
        .EEW-detection{
            grid-template-columns: 140px;
        }
    }
    @media (max-width: 930px){
        .EEW-detection{
            grid-area:2/1/3/2;
        } 
    }
    @media (max-width: 768px){
        .EEW-detection{
            grid-area:2/1/3/2;
        } 
    }
    @media (max-width: 768px){
        .EEW-detection{
            grid-area:2/1/3/2;
        } 
    }
    @media (max-width: 640px){
        .EEW-detection{
            display:grid;
            grid-template-rows: 100px;
            grid-template-columns: 100%;
        } 
    }
    .EEW-detection-left-explanation{
        margin-top:20px !important;
    }
    @media (max-width: 930px){
        .EEW-detection-left-explanation{
            margin-top:40px !important;
        }
    }
    @media (max-width: 768px){
        .EEW-detection-left-explanation{
            margin-top:40px !important;
        }
    }
    .EEW-detection-right-noninfomation{
        font-size:24px;
        margin-left:10px;
        text-align:left;
        position: absolute;
        top: 50%;
        -webkit-transform : translateY(-50%);
        transform : translateY(-50%);
    }
    @media (max-width: 640px){
        .EEW-detection-right-noninfomation{
            margin-left:0px;
        }
    }
    .EEW-detection-right{
        display:grid;
        grid-template-rows:25% 50% 25%;
        margin-left:10px;
        position:relative;
    }
    @media (max-width: 640px){
        .EEW-detection-right{
            height:100px;
        }
    }
    .EEW-detection-right-time{
        grid-area:1/1/2/2;
        margin-top:5px;
        font-size:20px;
    }
    .EEW-detection-right-happen{
        grid-area:2/1/3/2;
        font-size:36px;
        margin-top:5px;
        color:#FF7800;
    }
    @media (max-width: 930px){
        .EEW-detection-right-happen{
            font-size:34px;
        } 
    }
    @media (max-width: 768px){
        .EEW-detection-right-happen{
            font-size:34px;
        } 
    }
    .EEW-detection-right-area{
        grid-area:3/1/4/2;
        font-size:20px;
        overflow-x:hidden;
    }
    .EEW-detection-right-area-about{
        font-size:20px;
        position:absolute;
        bottom:0;
        left:0;
        padding:5px 0;
        background-color:#ffffff;
        padding-right:10px;
        z-index:10;
    }
    .EEW-detection-right-area-sapn{
        display     : inline-block;
        padding-left: 100%;
        white-space : nowrap;
        line-height : 1em;
        animation   : scrollAnime 20s linear infinite;
    }
    @keyframes scrollAnime{
        0% { transform: translateX(0)}
        100% { transform: translateX(-100%)}
    }
    .recent-quake{
        grid-area:2/1/3/2;
        display:grid;
        grid-template-columns: 150px;
    }
    @media (max-width: 1024px){
        .recent-quake{
            grid-template-columns: 130px;
        }
    }
    @media (max-width: 930px){
        .recent-quake{
            grid-area:3/1/4/2;
            grid-template-columns: 140px;
        } 
    }
    @media (max-width: 768px){
        .recent-quake{
            grid-area:3/1/4/2;
        } 
    }
    @media (max-width: 768px){
        .recent-quake{
            grid-template-columns: 140px;
        }
    }
    @media (max-width: 640px){
        .recent-quake{
            display:grid;
            grid-template-rows: 100px;
            grid-template-columns: 100%;
        } 
    }
    .recent-quake-right-correct{
        margin-left:10px;
        font-size:20px;
        background:#000000;
        color:#ffffff;
        padding-top:5px;
    }
    @media (max-width: 1024px){
        .recent-quake-right-correct{
            font-size:15px;
        }
    }
    @media (max-width: 930px){
        .recent-quake-right-correct{
            font-size:20px;
        }
    }
    @media (max-width: 768px){
        .recent-quake-right-correct{
            font-size:20px;
        }
    }
    @media (max-width: 640px){
        .recent-quake-right-correct{
            font-size:18px;
            margin:0 !important;
        }
    }
    .recent-quake-right-color-bar{
        padding-right:5px;
        text-align:right;
        font-size:36px;
    }
    @media (max-width: 1024px){
        .recent-quake-right-color-bar{
            font-size:30px;
        }
    }
    @media (max-width: 640px){
        .recent-quake-right-color-bar{
            margin-left:0 !important; 
        } 
    }
    .recent-quake-right-info-area-area-intencity{
        margin:15px 30px 10px 0;
    }
    .recent-quake-right-info-area-area-name{
        margin-left:20px;
        font-size:20px;
    }
    .recent-quake-right{
        overflow-y: scroll;
    }
    @media (max-width: 640px){
        .recent-quake-right{
            height:400px;
        } 
    }
    .recent-quake-right::-webkit-scrollbar{
        background-color:#ffffff;
        width:10px;
        height:10px
    }
    .recent-quake-right::-webkit-scrollbar-corner{
        background-color:transparent;
    }
    .recent-quake-right::-webkit-scrollbar-thumb{
        background-color:#c1c1c1;
    }
    .recent-quake-right::-webkit-scrollbar-button{
        background-color:#c1c1c1;
        height:10px;
    }
    .distribution{
        grid-area:2/2/3/4;
        display:grid;
        grid-template-columns: 150px;
    }
    @media (max-width: 1024px){
        .distribution{
            grid-template-columns: 130px;
        }
    }
    @media (max-width: 930px){
        .distribution{
            grid-area:4/1/5/2;
            grid-template-columns: 140px;
        } 
    }
    @media (max-width: 768px){
        .distribution{
            grid-area:4/1/5/2;
        } 
    }
    @media (max-width: 768px){
        .distribution{
            grid-template-columns: 140px;
        }
    }
    @media (max-width: 640px){
        .distribution{
            display:grid;
            grid-template-rows: 100px;
            grid-template-columns: 100%;
        } 
    }
    .distribution-right-map{
        width:calc(55vw - 140px);
        height:calc(55vh - 30px);
    }
    @media (max-width: 930px){
        .distribution-right-map{
            width:calc(90vw - 190px);
            height:calc(50vh - 25px);
        }
    }
    @media (max-width: 768px){
        .distribution-right-map{
            width:calc(90vw - 190px);
            height:calc(50vh - 25px);
        }
    }
    @media (max-width: 640px){
        .distribution-right-map{
            width:calc(100vw - 50px);
            height:calc(50vh - 25px);
        } 
    }
    .past-quake{
        grid-area:3/1/4/3;
        display:grid;
        grid-template-columns: 150px;
    }
    @media (max-width: 1024px){
        .past-quake{
            grid-template-columns: 130px;
        }
    }
    @media (max-width: 930px){
        .past-quake{
            grid-area:5/1/6/2;
            grid-template-columns: 140px;
        } 
    }
    @media (max-width: 768px){
        .past-quake{
            grid-area:5/1/6/2;
        } 
    }
    @media (max-width: 768px){
        .past-quake{
            grid-template-columns: 140px;
        }
    }
    @media (max-width: 640px){
        .past-quake{
            display:grid;
            grid-template-rows: 100px;
            grid-template-columns: 100%;
        } 
    }
    .past-quake-right{
        overflow-y:scroll;
        margin-left:10px;
    }
    @media (max-width: 640px){
        .past-quake-right{
            height:200px;
        } 
    }
    .past-quake-right::-webkit-scrollbar{
        background-color:#ffffff;
        width:10px;
        height:10px;
    }
    .past-quake-right::-webkit-scrollbar-corner{
        background-color:transparent;
    }
    .past-quake-right::-webkit-scrollbar-thumb{
        background-color:#c1c1c1;
    }
    .past-quake-right::-webkit-scrollbar-button{
        background-color:#c1c1c1;
        height:10px;
    }
    .past-quake-right-each-info{
        display:grid;
        grid-template-columns:60% 20% 20%;
        justify-content: space-between;
        place-content: end center;
        margin-top:5px;
    }
    @media (max-width: 320px){
        .past-quake-right-each-info{
            grid-template-columns:55% 20% 25%;
        }
    }
    .past-quake-right-each-info1{
        grid-area:1/1/2/2;
        margin-bottom:10px;
    }
    .past-quake-right-each-info1-time{
        font-size:18px;
    }
    @media (max-width: 1024px){
        .past-quake-right-each-info1-time{
            font-size:16px;
        }
    }
    @media (max-width: 320px){
        .past-quake-right-each-info1-time{
            font-size:12px;
        }
    }
    .past-quake-right-each-info2{
        grid-area:1/2/2/3;
    }
    .past-quake-right-each-info1-hypocenter{
        font-size:26px;
    }
    @media (max-width: 1024px){
        .past-quake-right-each-info1-hypocenter{
            font-size:22px;
        }
    }
    .past-quake-right-each-info2-magunitude{
        font-size:42px;
    }
    @media (max-width: 1024px){
        .past-quake-right-each-info2-magunitude{
            font-size:34px;
            margin-top:10px;
        }
    }
    @media (max-width: 640px){
        .past-quake-right-each-info2-magunitude{
            font-size:24px;
            margin-top:10px;
        }
    }
    .past-quake-right-each-info3{
        grid-area:1/3/3/4;
        text-align:right;
    }
    .past-quake-right-each-info3-inner{
        font-size:42px;
        text-align:left;
        display: inline-block;
        height: calc(100% - 15px);
        padding:5px 10px 5px 10px;
    }
    @media (max-width: 1024px){
        .past-quake-right-each-info3-inner{
            font-size:38px;
        }
    }
    .tsunami{
        grid-area:3/3/4/4;
        display:grid;
        grid-template-columns: 150px;
    }
    @media (max-width: 1024px){
        .tsunami{
            grid-template-columns: 130px;
        }
    }
    @media (max-width: 930px){
        .tsunami{
            grid-area:6/1/7/2;
            grid-template-columns: 140px;
        } 
    }
    @media (max-width: 768px){
        .tsunami{
            grid-area:6/1/7/2;
        } 
    }
    @media (max-width: 768px){
        .tsunami{
            grid-template-columns: 140px;
        }
    }
    @media (max-width: 640px){
        .tsunami{
            display:grid;
            grid-template-rows: 100px;
            grid-template-columns: 100%;
        } 
    }
    .tsunami-right{
        overflow-y:scroll;
        position: relative;
    }
    @media (max-width: 640px){
        .tsunami-right{
            height:150px;
        } 
    }
    .tsunami-right::-webkit-scrollbar{
        background-color:#ffffff;
        width:10px;
        height:10px;
    }
    .tsunami-right::-webkit-scrollbar-corner{
        background-color:transparent;
    }
    .tsunami-right::-webkit-scrollbar-thumb{
        background-color:#c1c1c1;
    }
    .tsunami-right::-webkit-scrollbar-button{
        background-color:#c1c1c1;
        height:10px;
    }
    .tsunami-right-noTsunami{
        font-size:24px;
        margin-left:10px;
        text-align:left;
        position: absolute;
        top: 50%;
        -webkit-transform : translateY(-50%);
        transform : translateY(-50%);
    }
    .tsunami-right-info{
        margin-left:10px;
        margin-bottom:10px;
        margin-top:5px;
    }
    .tunami-right-info-detail-issued{
        margin-top:5px;
    }
    .tunami-right-info-detail-areas{
        margin-left:30px;
        margin-bottom:5px;
    }
    .tunami-right-info-detail-areas-detail-area{
        font-size:18px;
    }
    .tunami-right-info-detail-areas-detail{
        display:inline-block;
    }
    .tunami-right-info-detail-areas-type{
        display:inline-block;
        font-size:36px;
        margin-right:15px;
    }
    .tunami-right-info-detail-areas-detail-come{
        font-size:18px;
    }
    @media (max-width: 1024px){
        .tunami-right-info-detail-areas-type{
            font-size:28px;
        }
        .tunami-right-info-detail-areas-detail-area{
            font-size:14px;
        }
        .tunami-right-info-detail-areas-detail-come{
            font-size:14px;
        }
    }
    .contents{
        padding:10px;
    }
    .contents-left{
        grid-area:1/1/2/2;
        border-right:2px solid #000000;
    }
    @media(max-width: 640px){
        .contents-left{
            grid-area:1/1/2/2;
            border-right:none;
            border-bottom:2px solid #000000;
            width:100%;
            display:flex;
            align-items: center;
        }
    }
    .contents-left-explanation{
        margin-top:40px;
        margin-right:10px;
        text-align:right;
    }
    @media(max-width: 640px){
        .contents-left-explanation{
            display:flex;
            align-items: center;
            margin:0 !important;
        }
    }
    .contents-left-explanation-ja{
        font-size:24px;
    }
    @media(max-width: 640px){
        .contents-left-explanation-ja{
            display:inline-block;
            margin-right:20px;
        }
    }
    .contents-left-explanation-en{

    }
    @media(max-width: 640px){
        .contents-left-explanation-en{
            display:inline-block;
            text-align: left;
        }
    }
    @media (max-width: 1024px){
        .contents-left-explanation-ja{
            font-size:20px;
        }
        .contents-left-explanation-en{
            font-size:14px
        }
    }
    .contents-right{
        grid-area:1/2/2/3;
    }
    @media(max-width: 640px){
        .contents-right{
            grid-area:2/1/3/2;
        }
    }
    .recent-quake-right-contents{
        margin-left:10px;
        margin-bottom:10px;
    }
    .recent-quake-right-info-contents{
        margin-bottom:10px;
    }
    .recent-quake-right-info-contents-title-ja{
        font-size:18px;
        display:inline-block;
    }
    .recent-quake-right-info-contents-title-en{
        display:inline-block;
    }
    .recent-quake-right-info-contents-content{
        margin-top:5px;
        margin-left:30px;
        font-size:24px;
    }
    @media (max-width: 1024px){
        .recent-quake-right-info-contents-title-ja{
            font-size:16px;
        }
        .recent-quake-right-info-contents-title-en{
            font-size:12px
        }
        .recent-quake-right-info-contents-content{
            font-size:20px;
        }
    }
</style>