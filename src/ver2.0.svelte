<script>
    import { pointData } from "./points.js"
    import { quakeScale } from "./quakeScale"
    import { areaName } from "./areaName"
    import { domesticTsunami } from "./domesticTsuname"
    import { epsp_area } from "./epsp-area"
    import { convertColor } from "./convertColor"
    import { tsunami_type } from "./tsunami-type"
    import { changeArray } from "./changeArray"
    import { convertScales } from "./convertScales"
    import { confidence} from "./confidence"
    import { sample1 } from "./sample1"
    import { sample2 } from "./sample2"
    import { sample3 } from "./sample3"
    import { sample4 } from "./sample4"
    import { scales_for_map } from "./scales-for-map"
    import {LeafletMap, Icon, Marker, TileLayer} from 'svelte-leafletjs';
    import moment from 'moment';

    
    console.log(quakeScale[10])
    let pointLength = pointData.length
    console.log(pointLength)
    console.log(pointData)

    let areaNameLength = areaName.length
    
    import { onMount } from "svelte";


    let options={
        center: [],
        zoom: [],
        markers: [],
        mapID: "map",
        tilelayers: [
            {
                url: "https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",
                attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
            }
        ],
    }



    let quake = []

    const getFirst = () => {
        console.log(Rjson)
        let length = Rjson.length
        for(let e = 0; e < length; e++){
            let info = Rjson[e]
            if(info.code == 551 && info.issue.type == "DetailScale"){
                quake[e] = {}
                quake[e].type = "DetailScale"
                let scaleTsunami = info.earthquake.domesticTsunami
                quake[e].domesticTsunami = domesticTsunami[scaleTsunami]
                quake[e].location = info.earthquake.hypocenter.name
                quake[e].magnitude = info.earthquake.hypocenter.magnitude
                quake[e].lat = info.earthquake.hypocenter.latitude
                quake[e].lon = info.earthquake.hypocenter.longitude
                quake[e].depth = info.earthquake.hypocenter.depth
                let scale = info.earthquake.maxScale
                quake[e].maxScale = quakeScale[scale]
                quake[e].time = info.earthquake.time
                quake[e].detailLength = info.points.length
                quake[e].points = info.points
                quake[e].arrayScale = {}
                for(let f = 0; f < 9; f++){
                    quake[e].arrayScale[f] = []
                }
                let scale1 = 0;
                let scale2 = 0;
                let scale3 = 0;
                let scale4 = 0;
                let scale45 = 0;
                let scale5 = 0;
                let scale55 = 0;
                let scale6 = 0;
                let scale7 = 0;
                for(let i = 0; i < info.points.length; i++){
                    let pointsScale = info.points[i].scale
                    let changed = quakeScale[pointsScale]
                    quake[e].points[i].changedScale = changed
                    if(info.points[i].changedScale == "1"){
                        quake[e].arrayScale[0][scale1] = info.points[i].addr
                        scale1++
                    }else if(info.points[i].changedScale == "2"){
                        quake[e].arrayScale[1][scale2] = info.points[i].addr
                        scale2++
                    }else if(info.points[i].changedScale == "3"){
                        quake[e].arrayScale[2][scale3] = info.points[i].addr
                        scale3++
                    }else if(info.points[i].changedScale == "4"){
                        quake[e].arrayScale[3][scale4] = info.points[i].addr
                        scale4++
                    }else if(info.points[i].changedScale == "5弱"){
                        quake[e].arrayScale[4][scale45] = info.points[i].addr
                        scale45++
                    }else if(info.points[i].changedScale == "5強"){
                        quake[e].arrayScale[5][scale5] = info.points[i].addr
                        scale5++
                    }else if(info.points[i].changedScale == "6弱"){
                        quake[e].arrayScale[6][scale55] = info.points[i].addr
                        scale55++
                    }else if(info.points[i].changedScale == "6強"){
                        quake[e].arrayScale[7][scale6] = info.points[i].addr
                        scale6++
                    }else if(info.points[i].changedScale == "7"){
                        quake[e].arrayScale[8][scale7] = info.points[i].addr
                        scale7++
                    }
                    for(let o = 0; o < pointLength; o++){
                        if(pointData[o].name == info.points[i].addr){
                            quake[e].points[i].lat = pointData[o].lat
                            quake[e].points[i].lon = pointData[o].lon
                            break;
                        }else{}
                    }
                }
            }else if(info.code == 551 && info.issue.type == "ScalePrompt"){
                quake[e] = {}
                quake[e].type = "ScalePrompt"
                let scale = info.earthquake.maxScale
                quake[e].maxScale = quakeScale[scale]
                quake[e].time = info.earthquake.time
                let scaleTsunami = info.earthquake.domesticTsunami
                quake[e].domesticTsunami = domesticTsunami[scaleTsunami]
                quake[e].points = info.points
                for(let i = 0; i < info.points.length; i++){
                    let pointsScale = info.points[i].scale
                    let changed = quakeScale[pointsScale]
                    quake[e].points[i].changedScale = changed
                    for(let o = 0; o < areaNameLength; o++){
                        if(areaName[o].area == info.points[i].addr){
                            quake[e].points[i].lat = areaName[o].lat
                            quake[e].points[i].lon = areaName[o].lon
                            break;
                        }
                    }
                }
            }else if(info.code == 551 && info.issue.type == "Destination"){
                quake[e] = {}
                quake[e].type = "Destination"
                quake[e].time = info.earthquake.time
                let scaleTsunami = info.earthquake.domesticTsunami
                quake[e].domesticTsunami = domesticTsunami[scaleTsunami]
                quake[e].lat = info.earthquake.hypocenter.latitude
                quake[e].lon = info.earthquake.hypocenter.longitude
                quake[e].magnitude = info.earthquake.hypocenter.magnitude
                quake[e].name = info.earthquake.hypocenter.name
                quake[e].depth = info.earthquake.hypocenter.depth
            }
        }
        console.log(quake)
        
        lastJson = apiHttps.responseText
        console.log(userQuakeJson)
        for(let i = 0; i < userQuakeJson.length; i++){
            let conf = userQuakeJson[i].confidence
            userQuakeJson[i].confLevel = {}
            userQuakeJson[i].area_conf = Object.entries(userQuakeJson[i].area_confidences)
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
        for(let i = 0; i < userQuakeJson.length; i++){
            if(userQuakeJson[i].confidence !== 0){
                judgeZero = i
                break
            }
            judgeZero = i
        }
        console.log(judgeZero)
    };

    const get = () => {
        console.log(Rjson)
        let length = Rjson.length
        for(let e = 0; e < length; e++){
            let info = Rjson[e]
            if(info.code == 551 && info.issue.type == "DetailScale"){
                quake[e] = {}
                quake[e].type = "DetailScale"
                let scaleTsunami = info.earthquake.domesticTsunami
                quake[e].domesticTsunami = domesticTsunami[scaleTsunami]
                quake[e].location = info.earthquake.hypocenter.name
                quake[e].magnitude = info.earthquake.hypocenter.magnitude
                quake[e].lat = info.earthquake.hypocenter.latitude
                quake[e].lon = info.earthquake.hypocenter.longitude
                quake[e].depth = info.earthquake.hypocenter.depth
                let scale = info.earthquake.maxScale
                quake[e].maxScale = quakeScale[scale]
                quake[e].time = info.earthquake.time
                quake[e].detailLength = info.points.length
                quake[e].points = info.points
                quake[e].arrayScale = {}
                for(let f = 0; f < 9; f++){
                    quake[e].arrayScale[f] = []
                }
                let scale1 = 0;
                let scale2 = 0;
                let scale3 = 0;
                let scale4 = 0;
                let scale45 = 0;
                let scale5 = 0;
                let scale55 = 0;
                let scale6 = 0;
                let scale7 = 0;
                for(let i = 0; i < info.points.length; i++){
                    let pointsScale = info.points[i].scale
                    let changed = quakeScale[pointsScale]
                    quake[e].points[i].changedScale = changed
                    if(info.points[i].changedScale == "1"){
                        quake[e].arrayScale[0][scale1] = info.points[i].addr
                        scale1++
                    }else if(info.points[i].changedScale == "2"){
                        quake[e].arrayScale[1][scale2] = info.points[i].addr
                        scale2++
                    }else if(info.points[i].changedScale == "3"){
                        quake[e].arrayScale[2][scale3] = info.points[i].addr
                        scale3++
                    }else if(info.points[i].changedScale == "4"){
                        quake[e].arrayScale[3][scale4] = info.points[i].addr
                        scale4++
                    }else if(info.points[i].changedScale == "5弱"){
                        quake[e].arrayScale[4][scale45] = info.points[i].addr
                        scale45++
                    }else if(info.points[i].changedScale == "5強"){
                        quake[e].arrayScale[5][scale5] = info.points[i].addr
                        scale5++
                    }else if(info.points[i].changedScale == "6弱"){
                        quake[e].arrayScale[6][scale55] = info.points[i].addr
                        scale55++
                    }else if(info.points[i].changedScale == "6強"){
                        quake[e].arrayScale[7][scale6] = info.points[i].addr
                        scale6++
                    }else if(info.points[i].changedScale == "7"){
                        quake[e].arrayScale[8][scale7] = info.points[i].addr
                        scale7++
                    }
                    for(let o = 0; o < pointLength; o++){
                        if(pointData[o].name == info.points[i].addr){
                            quake[e].points[i].lat = pointData[o].lat
                            quake[e].points[i].lon = pointData[o].lon
                            break;
                        }else{}
                    }
                }
            }else if(info.code == 551 && info.issue.type == "ScalePrompt"){
                quake[e] = {}
                quake[e].type = "ScalePrompt"
                let scale = info.earthquake.maxScale
                quake[e].maxScale = quakeScale[scale]
                quake[e].time = info.earthquake.time
                let scaleTsunami = info.earthquake.domesticTsunami
                quake[e].domesticTsunami = domesticTsunami[scaleTsunami]
                quake[e].points = info.points
                for(let i = 0; i < info.points.length; i++){
                    let pointsScale = info.points[i].scale
                    let changed = quakeScale[pointsScale]
                    quake[e].points[i].changedScale = changed
                    for(let o = 0; o < areaNameLength; o++){
                        if(areaName[o].area == info.points[i].addr){
                            quake[e].points[i].lat = areaName[o].lat
                            quake[e].points[i].lon = areaName[o].lon
                            break;
                        }
                    }
                }
            }else if(info.code == 551 && info.issue.type == "Destination"){
                quake[e] = {}
                quake[e].type = "Destination"
                quake[e].time = info.earthquake.time
                let scaleTsunami = info.earthquake.domesticTsunami
                quake[e].domesticTsunami = domesticTsunami[scaleTsunami]
                quake[e].lat = info.earthquake.hypocenter.latitude
                quake[e].lon = info.earthquake.hypocenter.longitude
                quake[e].magnitude = info.earthquake.hypocenter.magnitude
                quake[e].name = info.earthquake.hypocenter.name
                quake[e].depth = info.earthquake.hypocenter.depth
            }
        }
        console.log(quake)
        let r = 0
        if( lastJson !== apiHttps.responseText ){
            console.log("diff")
            if(Rjson[r].code == 551 && quake[r].type == "DetailScale"){
                options.center = [quake[r].lat, quake[r].lon]
                options.zoom = 9
                for(let q = 0; q < quake[r].points.length; q++){
                    options.markers[q] = {}
                    options.markers[q].lat = quake[r].points[q].lat
                    options.markers[q].lng = quake[r].points[q].lon
                    options.markers[q].iconSize = [20,20]
                    options.markers[q].iconAnchor = [-10,1-0]
                    if(quake[r].points[q].changedScale == "1"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/1.png"
                    }else if(quake[r].points[q].changedScale == "2"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/2.png"
                    }else if(quake[r].points[q].changedScale == "3"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/3.png"
                    }else if(quake[r].points[q].changedScale == "4"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/4.png"
                    }else if(quake[r].points[q].changedScale == "5弱"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/5-.png"
                    }else if(quake[r].points[q].changedScale == "5強"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/5+.png"
                    }else if(quake[r].points[q].changedScale == "6弱"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/6-.png"
                    }else if(quake[r].points[q].changedScale == "6強"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/6+.png"
                    }else if(quake[r].points[q].changedScale == "7"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/7.png"
                    }
                    if( options.markers[q].lat == undefined || options.markers[q].lng == undefined ){
                        options.markers[q].lat = 0
                        options.markers[q].lng = 0
                        options.markers[q].icon = {}
                        options.markers[q].iconSize = [0,0]
                        options.markers[q].icon.iconUrl = "/scale/undefined.png"
                    }
                }
                let last = options.markers.length
                options.markers[last+1] = {}
                options.markers[last+1].lat = quake[r].lat
                options.markers[last+1].lng = quake[r].lon
                options.markers[last+1].iconSize = [30,30]
                options.markers[last+1].iconAnchor = [-15,-15]
                options.markers[last+1].icon = {}
                options.markers[last+1].icon.iconUrl = "/scale/center.png"
            }

            if(Rjson[r].code == 551 && quake[r].type == "ScalePrompt"){
                let sumlat = 0;
                let sumlon = 0;
                for(let i = 0; i < quake[r].points.length; i++){
                    let replacedLat = quake[r].points[i].lat/quake[r].points.length
                    let replacedLon = quake[r].points[i].lon/quake[r].points.length
                    sumlat += replacedLat
                    sumlon += replacedLon
                }
                options.center = [Math.floor(sumlat * Math.pow(10,3))/Math.pow(10,3),Math.floor(sumlon * Math.pow(10,3))/Math.pow(10,3)]
                options.zoom = 7
                for(let q = 0; q < quake[r].points.length; q++){
                    options.markers[q] = {}
                    options.markers[q].lat = quake[r].points[q].lat
                    options.markers[q].lng = quake[r].points[q].lon
                    options.markers[q].iconSize = [20,20]
                    options.markers[q].iconAnchor = [-10,-10]
                    if(quake[r].points[q].changedScale == "1"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/1.png"
                    }else if(quake[r].points[q].changedScale == "2"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/2.png"
                    }else if(quake[r].points[q].changedScale == "3"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/3.png"
                    }else if(quake[r].points[q].changedScale == "4"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/4.png"
                    }else if(quake[r].points[q].changedScale == "5弱"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/5-.png"
                    }else if(quake[r].points[q].changedScale == "5強"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/5+.png"
                    }else if(quake[r].points[q].changedScale == "6弱"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/6-.png"
                    }else if(quake[r].points[q].changedScale == "6強"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/6+.png"
                    }else if(quake[r].points[q].changedScale == "7"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/7.png"
                    }
                }
            }

            if(Rjson[r].code == 551 && quake[r].type == "Destination"){
                let same;
                for(let i = r+1; i < Rjson.length; i++){
                    if(quake[r].time == quake[i].time){
                        same = i
                        console.log(same)
                    }
                }
                options.center = [quake[r].lat, quake[r].lon]
                options.zoom = 7
                for(let q = 0; q < quake[same].points.length; q++){
                    options.markers[q] = {}
                    options.markers[q].lat = quake[same].points[q].lat
                    options.markers[q].lng = quake[same].points[q].lon
                    options.markers[q].iconSize = [20,20]
                    options.markers[q].iconAnchor = [-10,-10]
                    if(quake[same].points[q].changedScale == "1"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/1.png"
                    }else if(quake[same].points[q].changedScale == "2"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/2.png"
                    }else if(quake[same].points[q].changedScale == "3"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/3.png"
                    }else if(quake[same].points[q].changedScale == "4"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/4.png"
                    }else if(quake[same].points[q].changedScale == "5弱"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/5-.png"
                    }else if(quake[same].points[q].changedScale == "5強"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/5+.png"
                    }else if(quake[same].points[q].changedScale == "6弱"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/6-.png"
                    }else if(quake[same].points[q].changedScale == "6強"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/6+.png"
                    }else if(quake[same].points[q].changedScale == "7"){
                        options.markers[q].icon = {}
                        options.markers[q].icon.iconUrl = "/scale/7.png"
                    }
                }
                let last = options.markers.length
                options.markers[last+1] = {}
                options.markers[last+1].lat = quake[r].lat
                options.markers[last+1].lng = quake[r].lon
                options.markers[last+1].iconSize = [30,30]
                options.markers[last+1].iconAnchor = [-15,-15]
                options.markers[last+1].icon = {}
                options.markers[last+1].icon.iconUrl = "/scale/center.png"
            }
            setTimeout(window.location.reload(), 3000)
        }
        lastJson = apiHttps.responseText
        console.log(userQuakeJson)
        for(let i = 0; i < userQuakeJson.length; i++){
            let conf = userQuakeJson[i].confidence
            userQuakeJson[i].confLevel = {}
            userQuakeJson[i].area_conf = Object.entries(userQuakeJson[i].area_confidences)
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
        for(let i = 0; i < userQuakeJson.length; i++){
            if(userQuakeJson[i].confidence !== 0){
                judgeZero = i
                break
            }
            judgeZero = i
        }
        console.log(judgeZero)
    };


    
    let judgeZero
    let Rjson;
    let lastQuakeJson;
    let userQuakeJson;
    let lastJson;
    let apiHttps;
    let tsunamiJson;
    try{
        apiHttps = new XMLHttpRequest();
        apiHttps.open("GET", "https://api.p2pquake.net/v2/history?codes=551&limit=2", false);
        apiHttps.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                console.log("success")
            }else{
                console.log("error")
                setTimeout(window.location.reload(), 3000)
            }
        }
        apiHttps.send();
        let log = apiHttps.responseText;
        lastJson = apiHttps.responseText;
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
        userQuake.open("GET", "https://api.p2pquake.net/v2/history?codes=9611&limit=1", false);
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
        tsunami.open("GET", "https://api.p2pquake.net/v2/history?codes=522&limit=4", false);
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

    tsunamiJson[0] = sample3[0]
    Rjson[0] = sample4[2]
    getFirst();

    setInterval(function(){
        try{
            apiHttps = new XMLHttpRequest();
            apiHttps.open("GET", "https://api.p2pquake.net/v2/history?codes=551&limit=2", false);
            apiHttps.send();
            const log = apiHttps.responseText;
            Rjson = JSON.parse(log);

            const lastQuake = new XMLHttpRequest();
            lastQuake.open("GET", "https://api.p2pquake.net/v2/jma/quake?limit=10&quake_type=DetailScale", false);
            lastQuake.send();
            const logQuakes = lastQuake.responseText;
            lastQuakeJson = JSON.parse(logQuakes);
            
            const tsunami = new XMLHttpRequest();
            tsunami.open("GET", "https://api.p2pquake.net/v2/history?codes=522&limit=4", false);
            tsunami.send();
            const tsunamiLog = tsunami.responseText;
            tsunamiJson = JSON.parse(tsunamiLog);
        }catch(e){
            console.log(e)
        };
        tsunamiJson[0] = sample3[0]
        Rjson[0] = sample4[2]
        get()
    },20000);

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
        get()
    },10000);

    let date;
    let nowDate;
    const getDate = () => {
        date = moment();
        nowDate = Number(date.format('YYYYMMDDHHMMSS.SSS'))
    }
    setInterval( getDate() , 1000 )
    console.log(date)
    console.log(nowDate)
    
    onMount(() => {
        const RecentQuake = document.getElementById("RecentQuake")
        const firstChild = RecentQuake.firstChild
        firstChild.remove()
    })

    const data_for_map = quake[0]
    const data_for_map2 = quake[1]

    const mapOptions = {
        center: [data_for_map.lat, data_for_map.lon],
        zoom: 9,
    };
    const tileUrl = "https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png";
    const tileLayerOptions = {
        minZoom: 0,
        maxZoom: 20,
        maxNativeZoom: 19,
        attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
    };
    const iconOptions = {
        iconUrl: '/scale/center.png',
        iconSize: [30, 30],
        iconAnchor:[15,15]
    };

    let sumlat = 0;
    let sumlon = 0;
    for(let i = 0; i < data_for_map.points.length; i++){
        let replacedLat = data_for_map.points[i].lat/data_for_map.points.length
        let replacedLon = data_for_map.points[i].lon/data_for_map.points.length
        sumlat += replacedLat
        sumlon += replacedLon
    }

    const noHypocenter = {
        center: [Math.floor(sumlat * Math.pow(10,3))/Math.pow(10,3),Math.floor(sumlon * Math.pow(10,3))/Math.pow(10,3)],
        zoom: 7,
    }

    let leafletMap;
    
    console.log(Number(userQuakeJson[0].updated_at.replace(/\/|:|\s/g,"")))
</script>

<div class="parent">
    <div class="logo contents"></div>
    <div class="EEW-detection contents">
        <div class="EEW-detection-left contents-left">
            <div class="EEW-detection-left-explanation contents-left-explanation">
                <div class="EEW-detection-left-explanation-ja contents-left-explanation-ja">地震感知情報</div>
                <div class="EEW-detection-left-explanation-en contents-left-explanation-en">earthquake<br>ditection</div>
            </div>
        </div>
        <div class="EEW-detection-right contents-right">
            {#if userQuakeJson[0].confidence != 0 && (moment(nowDate, "YYYYMMDDHHSS.SSS").diff(moment(userQuakeJson[0].updated_at.replace(/\/|:|\s/g,""), "YYYYMMDDHHSS.SSS"), "minutes") <= 5 )}
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
    <div class="recent-quake contents">
        <div class="recent-quake-left contents-left">
            <div class="recent-quake-left-explanation contents-left-explanation">
                <div class="recent-quake-left-explanation-ja contents-left-explanation-ja">最新の地震</div>
                <div class="recent-quake-left-explanation-en contents-left-explanation-en">rececnt<br>earthquake</div>
            </div>
        </div>
        <div class="recent-quake-right contents-right">
            {#if (quake[0].type == "DetailScale")}
            <div class="recent-quake-right-color-bar recent-quake-right-contents" style="background-color:{convertColor[Rjson[0].earthquake.maxScale][0]}; color:{convertColor[Rjson[0].earthquake.maxScale][1]};">{quake[0].maxScale}</div>
            <div class="recent-quake-right-info recent-quake-right-contents">
                <div class="recent-quake-right-info-time recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-time-title-ja recent-quake-right-info-contents-title-ja">時刻</div>
                    <div class="recent-quake-right-info-time-title-en recent-quake-right-info-contents-title-en">time</div>
                    <div class="recent-quake-right-info-time-time recent-quake-right-info-contents-content">{quake[0].time}</div>
                </div>
                <div class="recent-quake-right-info-intensity recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-intensity-title-ja recent-quake-right-info-contents-title-ja">最大震度</div>
                    <div class="recent-quake-right-info-intensity-title-en recent-quake-right-info-contents-title-en">max intensity</div>
                    <div class="recent-quake-right-info-intensity-intensity recent-quake-right-info-contents-content">{quake[0].maxScale}</div>
                </div>
                <div class="recent-quake-right-info-magunitude recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-magunitude-title-ja recent-quake-right-info-contents-title-ja">マグニチュード</div>
                    <div class="recent-quake-right-info-magunitude-title-en recent-quake-right-info-contents-title-en">magunitude</div>
                    <div class="recent-quake-right-info-magunitude-magunitude recent-quake-right-info-contents-content">{quake[0].magnitude}</div>
                </div>
                <div class="recent-quake-right-info-hypocenter recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-hypocenter-title-ja recent-quake-right-info-contents-title-ja">震源</div>
                    <div class="recent-quake-right-info-hypocenter-title-en recent-quake-right-info-contents-title-en">hypocenter</div>
                    <div class="recent-quake-right-info-hypocenter-hypocenter recent-quake-right-info-contents-content">{quake[0].location}</div>
                </div>
                <div class="recent-quake-right-info-depth recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-depth-title-ja recent-quake-right-info-contents-title-ja">深さ</div>
                    <div class="recent-quake-right-info-depth-title-en recent-quake-right-info-contents-title-en">depth of the hypocenter</div>
                    <div class="recent-quake-right-info-depth-depth recent-quake-right-info-contents-content">約{quake[0].depth}km</div>
                </div>
                <div class="recent-quake-right-info-tsunami recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-tsunami-title-ja recent-quake-right-info-contents-title-ja">津波</div>
                    <div class="recent-quake-right-info-tsunami-title-en recent-quake-right-info-contents-title-en">possibility of tsunami</div>
                    <div class="recent-quake-right-info-tsunami-tsunami recent-quake-right-info-contents-content">{quake[0].domesticTsunami}</div>
                </div>
                <div class="recent-quake-right-info-area recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-area-title-ja recent-quake-right-info-contents-title-ja">各地の震度</div>
                    <div class="recent-quake-right-info-area-title-en recent-quake-right-info-contents-title-en">intensity in each area</div>
                    <div class="recent-quake-right-info-area-area recent-quake-right-info-contents-content">
                        {#each changeArray as change}
                        {#if quake[0].arrayScale[change].length > 0}
                        <div class="recent-quake-right-info-area-area-intencity">{convertScales[change]}</div>
                        {#each quake[0].arrayScale[change] as location}
                        <div class="recent-quake-right-info-area-area-name">{location}</div>
                        {/each}
                        {/if}
                        {/each}
                    </div>
                </div>
            </div>
            {:else if (quake[0].type == "Destination")}
            <div class="recent-quake-right-color-bar recent-quake-right-contents" style="background-color:{convertColor[Rjson[0].earthquake.maxScale][0]}; color:{convertColor[Rjson[0].earthquake.maxScale][1]};">{quake[0].maxScale}</div>
            <div class="recent-quake-right-info recent-quake-right-contents">
                <div class="recent-quake-right-info-time recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-time-title-ja recent-quake-right-info-contents-title-ja">時刻</div>
                    <div class="recent-quake-right-info-time-title-en recent-quake-right-info-contents-title-en">time</div>
                    <div class="recent-quake-right-info-time-time recent-quake-right-info-contents-content">{quake[0].time}</div>
                </div>
                <div class="recent-quake-right-info-intensity recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-intensity-title-ja recent-quake-right-info-contents-title-ja">最大震度</div>
                    <div class="recent-quake-right-info-intensity-title-en recent-quake-right-info-contents-title-en">max intensity</div>
                    <div class="recent-quake-right-info-intensity-intensity recent-quake-right-info-contents-content">{quake[1].maxScale}</div>
                </div>
                <div class="recent-quake-right-info-magunitude recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-magunitude-title-ja recent-quake-right-info-contents-title-ja">マグニチュード</div>
                    <div class="recent-quake-right-info-magunitude-title-en recent-quake-right-info-contents-title-en">magunitude</div>
                    <div class="recent-quake-right-info-magunitude-magunitude recent-quake-right-info-contents-content">{quake[0].magnitude}</div>
                </div>
                <div class="recent-quake-right-info-hypocenter recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-hypocenter-title-ja recent-quake-right-info-contents-title-ja">震源</div>
                    <div class="recent-quake-right-info-hypocenter-title-en recent-quake-right-info-contents-title-en">hypocenter</div>
                    <div class="recent-quake-right-info-hypocenter-hypocenter recent-quake-right-info-contents-content">{quake[0].name}</div>
                </div>
                <div class="recent-quake-right-info-depth recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-depth-title-ja recent-quake-right-info-contents-title-ja">深さ</div>
                    <div class="recent-quake-right-info-depth-title-en recent-quake-right-info-contents-title-en">depth of the hypocenter</div>
                    <div class="recent-quake-right-info-depth-depth recent-quake-right-info-contents-content">約{quake[0].depth}km</div>
                </div>
                <div class="recent-quake-right-info-tsunami recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-tsunami-title-ja recent-quake-right-info-contents-title-ja">津波</div>
                    <div class="recent-quake-right-info-tsunami-title-en recent-quake-right-info-contents-title-en">possibility of tsunami</div>
                    <div class="recent-quake-right-info-tsunami-tsunami recent-quake-right-info-contents-content">{quake[0].domesticTsunami}</div>
                </div>
                <div class="recent-quake-right-info-area recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-area-title-ja recent-quake-right-info-contents-title-ja">各地の震度</div>
                    <div class="recent-quake-right-info-area-title-en recent-quake-right-info-contents-title-en">intensity in each area</div>
                    <div class="recent-quake-right-info-area-area recent-quake-right-info-contents-content">調査中</div>
                </div>
            </div>
            {:else if (quake[0].type == "ScalePrompt")}
            <div class="recent-quake-right-color-bar recent-quake-right-contents" style="background-color:{convertColor[Rjson[0].earthquake.maxScale][0]}; color:{convertColor[Rjson[0].earthquake.maxScale][1]};">{quake[0].maxScale}</div>
            <div class="recent-quake-right-info recent-quake-right-contents">
                <div class="recent-quake-right-info-time recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-time-title-ja recent-quake-right-info-contents-title-ja">時刻</div>
                    <div class="recent-quake-right-info-time-title-en recent-quake-right-info-contents-title-en">time</div>
                    <div class="recent-quake-right-info-time-time recent-quake-right-info-contents-content">{quake[0].time}</div>
                </div>
                <div class="recent-quake-right-info-intensity recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-intensity-title-ja recent-quake-right-info-contents-title-ja">最大震度</div>
                    <div class="recent-quake-right-info-intensity-title-en recent-quake-right-info-contents-title-en">max intensity</div>
                    <div class="recent-quake-right-info-intensity-intensity recent-quake-right-info-contents-content">{quake[1].maxScale}</div>
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
                    <div class="recent-quake-right-info-tsunami-tsunami recent-quake-right-info-contents-content">調査中</div>
                </div>
                <div class="recent-quake-right-info-area recent-quake-right-info-contents">
                    <div class="recent-quake-right-info-area-title-ja recent-quake-right-info-contents-title-ja">各地の震度</div>
                    <div class="recent-quake-right-info-area-title-en recent-quake-right-info-contents-title-en">intensity in each area</div>
                    <div class="recent-quake-right-info-area-area recent-quake-right-info-contents-content">調査中</div>
                </div>
            </div>
            {/if}
        </div>
    </div>
    <div class="distribution contents">
        <div class="distribution-left contents-left">
            <div class="distribution-left-explanation contents-left-explanation">
                <div class="distribution-left-explanation-ja contents-left-explanation-ja">震度分布</div>
                <div class="distribution-left-explanation-en contents-left-explanation-en">rececnt<br>earthquake's<br>intensity<br>distribution</div>
            </div>
        </div>
        <div class="distribution-right contents-right">
            <div class="distribution-right-map">
                {#if data_for_map.type == "DetailScale" | data_for_map.type == "ScalePrompt"}
                <LeafletMap bind:this={leafletMap} options={mapOptions}>
                    <TileLayer url={tileUrl} options={tileLayerOptions}/>
                    {#each data_for_map.points as point}
                        {#each scales_for_map as scales}
                            {#if point.scale == scales[0]}
                            {#if point.lat != null || point.lon != null}
                                <Marker latLng={[point.lat, point.lon]} zIndexOffset={scales[2]}>
                                    <Icon options={scales[1]}/>
                                </Marker>
                            {/if}
                            {/if}
                        {/each}
                    {/each}
                    {#if (data_for_map.type == "DetailScale")}
                        {#if data_for_map.lat !== null || data_for_map.lon !== null}
                        <Marker latLng={[data_for_map.lat, data_for_map.lon]} zIndexOffset={5000}>
                            <Icon options={iconOptions}/>
                        </Marker>
                        {/if}
                    {:else if (data_for_map.type == "ScalePrompt")}
                        {#if data_for_map2.lat !== null || data_for_map2.lon !== null}
                        <Marker latLng={[data_for_map2.lat, data_for_map2.lon]} zIndexOffset={5000}>
                            <Icon options={iconOptions}/>
                        </Marker>
                        {/if}
                    {/if}
                </LeafletMap>
                {:else if data_for_map.type == "Destination"}
                <LeafletMap bind:this={leafletMap} options={noHypocenter}>
                    <TileLayer url={tileUrl} options={tileLayerOptions}/>
                    {#each data_for_map.points as point}
                        {#each scales_for_map as scales}
                            {#if point.scale == scales[0]}
                                {#if point.lat !== null || point.lon !== null}
                                <Marker latLng={[point.lat, point.lon]} zIndexOffset={scales[2]}>
                                    <Icon options={scales[1]}/>
                                </Marker>
                                {/if}
                            {/if}
                        {/each}
                    {/each}
                </LeafletMap>
                {/if}
            </div>
        </div>
    </div>
    <div class="past-quake contents">
        <div class="past-quake-left contents-left">
            <div class="past-quake-left-explanation contents-left-explanation">
                <div class="past-quake-left-explanation-ja contents-left-explanation-ja">過去の地震</div>
                <div class="past-quake-left-explanation-en contents-left-explanation-en">rececnt<br>earthquake</div>
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
                    <div class="past-quake-right-each-info3-inner" style="background-color:{convertColor[recentQuake.earthquake.maxScale][0]}; color:{convertColor[recentQuake.earthquake.maxScale][1]};"><span style="font-size:12px;">震度</span>{quakeScale[recentQuake.earthquake.maxScale]}</div>
                </div>                
            </div>
            {/each}
        </div>
    </div>
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
                        <div class="tunami-right-info-detail-areas-type" style="border-left:10px solid {tsunami_type[areas.grade][1]}">{tsunami_type[areas.grade][0]}</div>
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
                    <div class="tunami-right-info-detail-issued recent-quake-right-info-contents-content">キャンセル</div>
                    {/if}
                </div>
            </div>
            {/each}
            {/if}
        </div>
    </div>
</div>



<style>
    .parent{
        width:calc(100vw - 20px);
        height:calc(100vh - 20px);
        padding:10px;
        display:grid;
        grid-template-rows: 15% 55% 30%;
        grid-template-columns: 40% 10% 50%;
    }
    .logo{
        grid-area:1/1/2/2;
    }
    .EEW-detection{
        grid-area:1/2/2/4;
        display:grid;
        grid-template-columns: 160px;
        position: relative;
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
    .EEW-detection-right{
        display:grid;
        grid-template-rows:25% 50% 25%;
        margin-left:10px;
        position:relative;
    }
    .EEW-detection-right-time{
        grid-area:1/1/2/2;
    }
    .EEW-detection-right-happen{
        grid-area:2/1/3/2;
        font-size:40px;
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
    .recent-quake-right-color-bar{
        text-align:right;
        color:#FFFFFF;
        font-size:36px;
    }
    .recent-quake-right-info-area-area-intencity{
        margin:15px 0 10px 0;
    }
    .recent-quake-right-info-area-area-name{
        margin-left:20px;
        font-size:20px;
    }
    .recent-quake-right{
        overflow-y: scroll;
    }
    .recent-quake-right::-webkit-scrollbar{
        background-color:#ffffff;
        width:5px;
    }
    .recent-quake-right::-webkit-scrollbar-corner{
        background-color:transparent;
    }
    .recent-quake-right::-webkit-scrollbar-thumb{
        background-color:#c1c1c1;
    }
    .recent-quake-right::-webkit-scrollbar-button{
        background-color:#c1c1c1;
        height:5px;
    }
    .distribution{
        grid-area:2/2/3/4;
        display:grid;
        grid-template-columns: 150px;
    }
    .distribution-right-map{
        width:calc(55vw - 140px);
        height:calc(55vh - 30px);
    }
    .past-quake{
        grid-area:3/1/4/3;
        display:grid;
        grid-template-columns: 150px;
    }
    .past-quake-right{
        overflow-y:scroll;
        margin-left:10px;
    }
    .past-quake-right::-webkit-scrollbar{
        background-color:#ffffff;
        width:5px;
    }
    .past-quake-right::-webkit-scrollbar-corner{
        background-color:transparent;
    }
    .past-quake-right::-webkit-scrollbar-thumb{
        background-color:#c1c1c1;
    }
    .past-quake-right::-webkit-scrollbar-button{
        background-color:#c1c1c1;
        height:5px;
    }
    .past-quake-right-each-info{
        display:grid;
        grid-template-columns:60% 20% 20%;
        justify-content: space-between;
        place-content: end center;
    }
    .past-quake-right-each-info1{
        grid-area:1/1/2/2;
        margin-bottom:10px;
    }
    .past-quake-right-each-info1-time{
        font-size:18px;
    }
    .past-quake-right-each-info2{
        grid-area:1/2/2/3;
    }
    .past-quake-right-each-info1-hypocenter{
        font-size:26px;
    }
    .past-quake-right-each-info2-magunitude{
        font-size:42px;
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
        padding:5px 10px 0 5px;
    }
    .tsunami{
        grid-area:3/3/4/4;
        display:grid;
        grid-template-columns: 150px;
    }
    .tsunami-right{
        overflow-y:scroll;
        position: relative;
    }
    .tsunami-right::-webkit-scrollbar{
        background-color:#ffffff;
        width:5px;
    }
    .tsunami-right::-webkit-scrollbar-corner{
        background-color:transparent;
    }
    .tsunami-right::-webkit-scrollbar-thumb{
        background-color:#c1c1c1;
    }
    .tsunami-right::-webkit-scrollbar-button{
        background-color:#c1c1c1;
        height:5px;
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
        margin-bottom:15px;
    }
    .tunami-right-info-detail-areas{
        margin-left:30px;
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
        margin-right:20px;
    }
    .tunami-right-info-detail-areas-detail-come{
        font-size:18px;
    }
    .contents{
        padding:10px;
    }
    .contents-left{
        grid-area:1/1/2/2;
        border-right:2px solid #000000;
    }
    .contents-left-explanation{
        margin-top:40px;
        margin-right:10px;
        text-align:right;
    }
    .contents-left-explanation-ja{
        font-size:24px;
    }
    .contents-left-explanation-en{

    }
    .contents-right{
        grid-area:1/2/2/3;
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
        margin-left:30px;
        font-size:24px;
    }
</style>