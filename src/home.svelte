<script>
    import { pointData } from "./points.js"
    import { quakeScale } from "./quakeScale"
    import { areaName } from "./areaName"
    import { domesticTsunami } from "./domesticTsuname"
    import { epsp_area } from "./epsp-area"
    import { convertColor } from "./convertColor"
    import { tsunami_type } from "./tsunami-type"


    console.log(quakeScale[10])
    let pointLength = pointData.length
    console.log(pointLength)
    console.log(pointData)

    let areaNameLength = areaName.length
    
    import Map from '@anoram/leaflet-svelte'
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
        let r = 0
        //if( lastJson !== apiHttps.responseText ){
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
                        options.markers[q].setZIndexOffset = 1000
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
                        ptions.markers[q].icon = {}
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
                console.log(options)
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
        //}
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
                        ptions.markers[q].icon = {}
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
    let trainInfoJson;
    try{
        apiHttps = new XMLHttpRequest();
        apiHttps.open("GET", "https://api.p2pquake.net/v2/history?codes=551", false);
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
        userQuake.open("GET", "https://api.p2pquake.net/v2/history?codes=9611&limit=20", false);
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
        tsunami.open("GET", "https://api.p2pquake.net/v2/history?codes=522", false);
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

        const trainInfo = new XMLHttpRequest();
        trainInfo.open("GET", "https://tetsudo.rti-giken.jp/free/delay.json", false);
        trainInfo.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                console.log("success")
            }else{
                console.log("error")
                setTimeout(window.location.reload(), 3000)
            }
        }
        trainInfo.send();
        const trainInfoLog = trainInfo.responseText;
        trainInfoJson = JSON.parse(trainInfoLog);
    }catch(e){
        setTimeout(window.location.reload(), 3000)
    };
    
    getFirst();
    setInterval(function(){
        try{
            apiHttps = new XMLHttpRequest();
            apiHttps.open("GET", "https://api.p2pquake.net/v2/history?codes=551", false);
            apiHttps.send();
            const log = apiHttps.responseText;
            Rjson = JSON.parse(log);

            const lastQuake = new XMLHttpRequest();
            lastQuake.open("GET", "https://api.p2pquake.net/v2/jma/quake?limit=10&quake_type=DetailScale", false);
            lastQuake.send();
            const logQuakes = lastQuake.responseText;
            lastQuakeJson = JSON.parse(logQuakes);
            
            const tsunami = new XMLHttpRequest();
            tsunami.open("GET", "https://api.p2pquake.net/v2/history?codes=522", false);
            tsunami.send();
            const tsunamiLog = tsunami.responseText;
            tsunamiJson = JSON.parse(tsunamiLog);
        }catch(e){
            console.log(e)
        };
        get()
    },20000);

    setInterval(function(){
        try{
            const userQuake = new XMLHttpRequest();
            userQuake.open("GET", "https://api.p2pquake.net/v2/history?codes=9611&limit=20", false);
            userQuake.send();
            const userQuakeLog = userQuake.responseText;
            userQuakeJson = JSON.parse(userQuakeLog);
        }catch(e){
            console.log(e)
        };
        get()
    },10000);

    setInterval(function(){
        try{
            const trainInfo = new XMLHttpRequest();
            trainInfo.open("GET", "https://tetsudo.rti-giken.jp/free/delay.json", false);
            trainInfo.send();
            const trainInfoLog = trainInfo.responseText;
            trainInfoJson = JSON.parse(trainInfoLog);
        }catch(e){
            console.log(e)
        };
    }, 600000);

    onMount(() => {
        const RecentQuake = document.getElementById("RecentQuake")
        const firstChild = RecentQuake.firstChild
        firstChild.remove()
    })
</script>


<div class="parent">
    <div class="EEWDetection">
        <div style="font-size:20px; width:130px; ;flex-shrink: 0;">鉄道遅延情報</div>
        <div style=" overflow-x:scroll; height:43px; white-space: nowrap; margin:0;">
            {#each trainInfoJson as train }
            <div style="display:inline-block;margin-bottom:0px; margin-top:15px;" class="info">{train.company}/{train.name}</div>
            {/each}
        </div>
    </div>
    <div class="detail">
        {#if (quake[0].type == "DetailScale")}
            <div style="font-size:25px;"><p>{quake[0].time}</p><p>発生</p></div>
            <div><p class="small">最大震度</p><p class="num">{quake[0].maxScale}</p></div>
            <div><p class="small">マグニチュード</p><p class="num">{quake[0].magnitude}</p></div>
            <div><p class="small">震源</p><p class="any">{quake[0].location}</p></div>
            <div><p class="small">深さ</p><p class="any">約{quake[0].depth}km</p></div>
            <div><p class="small">津波</p><p class="any">{quake[0].domesticTsunami}</p></div>
            <div class="scales">
                <p class="small" style="padding-top:29.6px; padding-bottom:20px; display:inline-block">各地の震度</p>
                    {#if quake[0].arrayScale[8].length > 0}
                        <p class="sindo" style="border-bottom:2px solid #FF1E56;">震度7</p>
                        <div>
                            {#each quake[0].arrayScale[8] as scales}
                                <p>{scales}</p>
                            {/each}
                        </div>
                    {/if}
                    {#if quake[0].arrayScale[7].length > 0}
                        <p class="sindo" style="border-bottom:2px solid #FF8BA0;">震度6強</p>
                        <div>
                            {#each quake[0].arrayScale[7] as scales}
                                <p>{scales}</p>
                            {/each}
                        </div>
                    {/if}
                    {#if quake[0].arrayScale[6].length > 0}
                        <p class="sindo" style="border-bottom:2px solid #FF8BA0;">震度6弱</p>
                        <div>
                            {#each quake[0].arrayScale[6] as scales}
                                <p>{scales}</p>
                            {/each}
                        </div>
                    {/if}
                    {#if quake[0].arrayScale[5].length > 0}
                        <p class="sindo" style="border-bottom:2px solid #C70039;">震度5強</p>
                        <div>
                            {#each quake[0].arrayScale[5] as scales}
                                <p>{scales}</p>
                            {/each}
                        </div>
                    {/if}
                    {#if quake[0].arrayScale[4].length > 0}
                        <p class="sindo" style="border-bottom:2px solid #C70039;">震度5弱</p>
                        <div>
                            {#each quake[0].arrayScale[4] as scales}
                                <p>{scales}</p>
                            {/each}
                        </div>
                    {/if}
                    {#if quake[0].arrayScale[3].length > 0}
                        <p class="sindo" style="border-bottom:2px solid #ED5107;">震度4</p>
                        <div>
                            {#each quake[0].arrayScale[3] as scales}
                                <p>{scales}</p>
                            {/each}
                        </div>
                    {/if}
                    {#if quake[0].arrayScale[2].length > 0}
                        <p class="sindo" style="border-bottom:2px solid #FFAC41;">震度3</p>
                        <div>
                            {#each quake[0].arrayScale[2] as scales}
                                <p>{scales}</p>
                            {/each}
                        </div>
                    {/if}
                    {#if quake[0].arrayScale[1].length > 0}
                        <p class="sindo" style="border-bottom:2px solid #4E9F3D;">震度2</p>
                        <div>
                            {#each quake[0].arrayScale[1] as scales}
                                <p>{scales}</p>
                            {/each}
                        </div>
                    {/if}
                    {#if quake[0].arrayScale[0].length > 0}
                        <p class="sindo" style="border-bottom:2px solid #BBE1FA;">震度1</p>
                        <div>
                            {#each quake[0].arrayScale[0] as scales}
                                <p>{scales}</p>
                            {/each}
                        </div>
                    {/if}
            </div>
        {:else if (quake[0].type == "Destination")}
            <div style="font-size:25px;"><p>{quake[0].time}</p><p>発生</p></div>
            <div><p class="small">最大震度</p><p class="num">{quake[1].maxScale}</p></div>
            <div><p class="small">マグニチュード</p><p class="num">{quake[0].magnitude}</p></div>
            <div><p class="small">震源</p><p class="any">{quake[0].name}</p></div>
            <div><p class="small">深さ</p><p class="any">約{quake[0].depth}km</p></div>
            <div><p class="small">津波</p><p class="any">{quake[0].domesticTsunami}</p></div>
            <div><p class="small">各地の震度</p><p  style="font-size:30px; padding-top:20px;">調査中</p></div>
        {:else if (quake[0].type == "ScalePrompt")}
            <div style="font-size:25px;"><p>{quake[0].time}</p><p>発生</p></div>
            <div><p class="small">最大震度</p><p class="num">{quake[0].maxScale}</p></div>
            <div><p class="small">マグニチュード</p><p class="num" style="font-size:30px;">調査中</p></div>
            <div><p class="small">震源</p><p class="any">調査中</p></div>
            <div><p class="small">深さ</p><p class="any">調査中</p></div>
            <div><p class="small">津波</p><p class="any">調査中</p></div>
            <div><p class="small">各地の震度</p><p  style="font-size:30px; padding-top:20px;">調査中</p></div>
        {/if}
    </div>
    <div class="mapParent">
        <div class="map">
            <Map {options} id="map"></Map>
        </div>        
    </div>
    <div class="UserQuake">
        {#if judgeZero == 19}
            <div class="noTsunami">地震感知情報無し</div>
        {:else}
            {#each userQuakeJson as userQuake}
                {#if userQuake.confidence !== 0}
                    <div style=" padding-bottom:5px; border-bottom:1px solid #444444;">
                        <div style="font-size:25px;">
                            <p style="color:{convertColor[userQuake.confLevel]}; font-weight:600;">{userQuake.confLevel}</p>
                            <p>件数{userQuake.count}</p>
                        </div>
                        <p><span style="font-size:12px; margin-right:5px;">開始</span>{userQuake.started_at}</p>
                        <p><span style="font-size:12px; margin-right:5px;">更新</span>{userQuake.updated_at}</p>
                        {#each userQuake.area_conf as eachArea}
                            {#if (eachArea.length !== 0)}
                                <div>
                                    <p style="color:{convertColor[eachArea[1].display]}">{eachArea[2]}</p>
                                    <p style="color:{convertColor[eachArea[1].display]}"><span style="font-size:12px;">件数</span>{eachArea[1].count}</p>
                                    <p style="color:{convertColor[eachArea[1].display]}"><span style="font-size:12px;">信頼度</span>{eachArea[1].display}</p>
                                </div>
                            {/if}
                        {/each}
                    </div>
                {/if}
            {/each}
        {/if}
    </div>
    <div class="RecentQuake" id="RecentQuake">
        {#each lastQuakeJson as recentQuake}
            <div style="position:relative; display:grid; grid-tmplate-row:20% 80%; grid-template-columns:65% 15% 20%; padding-bottom:5px; border-bottom:1px solid #444444;">
                <div class="recentTime">{recentQuake.earthquake.time}</div>
                <div class="recentLocation">{recentQuake.earthquake.hypocenter.name}</div>
                <div class="recentMagunitude"><span>M</span><span style="font-size:40px;">{recentQuake.earthquake.hypocenter.magnitude}</span></div>
                <div class="recentMaxscale" style="color:{convertColor[recentQuake.earthquake.maxScale]};">{quakeScale[recentQuake.earthquake.maxScale]}</div>
            </div>    
        {/each}
    </div>
    <div class="other">
        {#if tsunamiJson.length == 0 }
            <div class="noTsunami">津波予報無し</div>
        {/if}
        {#each tsunamiJson as tsunami}
            {#if tsunami.cancelled == false}
                <div style="padding:0 0 5px 0; border-bottom:1px solid #444444;">
                    <p><span style="font-size:20px;">{tsunami.issue.time}</span>発表</p>
                    <p style="font-size:30px; margin:15px 0;">津波情報発表</p>
                    <p>以下の津波情報が発表されました</p>
                    {#each tsunami.areas as areas}
                        <div>
                            <p style="font-size:25px; margin-bottom:5px;">{areas.name}</p>
                            <p style="display:inline-block; font-size:20px; color:{convertColor[areas.grade]}">{tsunami_type[areas.grade]}</p>
                            {#if areas.immediate == true}
                                <p style="display:inline-block;">直ちに来襲</p>
                            {:else if areas.immediate == false}
                                <p style="display:inline-block;">直ちに来襲せず</p>
                            {/if}
                        </div>
                    {/each}
                </div>
            {:else if tsunami.cancelled == true}
                <div style="padding:0 0 5px 0; border-bottom:1px solid #444444;">
                    <p><span style="font-size:20px;">{tsunami.issue.time}</span>発表</p>
                    <p style="font-size:30px; margin:15px 0;">キャンセル</p>
                    <p>先ほどの津波情報はキャンセルされました</p>
                </div>
            {/if}
        {/each}
    </div>
</div>



<style>
    .parent{
        height:100%;
        margin:20px;
        display:grid;
        grid-template-rows:8% 62% 30%;
        grid-template-columns:30% 0% 40% 30%;
    }
    .parent div{
        margin:10px;
        position:relative;
    }
    .parent div::-webkit-scrollbar{
        width: 10px;
        height:7px;
        background-color: #1e1e1e;
    }
    .parent div::-webkit-scrollbar-track{
        border-radius: 5px;
        background-color: transparent;
    }
    .parent div::-webkit-scrollbar-thumb{
        border-radius:10px;
        background-color:#a5a5a5;
    }
    .EEWDetection{
        grid-area:1/1/2/5;
        border-left:5px solid #03DAC5;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 7px 29px 0px;
        display: flex;
        align-items: center;
    }
    .detail{
        grid-area:2/1/3/2;
        overflow-y: scroll;
        border-left:5px solid #03DAC5;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 7px 29px 0px; 
    }
    .detail div p{
        display:inline-block;
    } 
    .detail div{
        margin:10px 0 10px 10px;
    }
    .detail div .small{
        font-size:20px;
        text-align: left;
        margin-right:3px;
    }
    .detail div .any{
        font-size:30px;
        padding-top:20px;
    }
    .detail div .num{
        font-size:50px
    }
    .scales div p{
        display:block;
        margin:10px;
    }
    .sindo{
        display:block !important;
        width:50%;
        font-size:30px;
    }
    .mapParent{
        grid-area:2/2/3/5;
        border-left:5px solid #03DAC5;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 7px 29px 0px; 
    }
    .UserQuake{
        grid-area:3/1/4/3;
        overflow-y: scroll;
        border-left:5px solid #03DAC5;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 7px 29px 0px; 
    }
    .UserQuake div div{
        margin-left:0;
        margin-right:0;
    }
    .UserQuake div div p{
        display:inline-block;
    }
    .RecentQuake{
        grid-area:3/3/4/4;
        overflow-y: scroll;
        border-left:5px solid #03DAC5;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 7px 29px 0px; 
    }
    .RecentQuake div div{
        margin:0;
    }
    .recentTime{
        grid-area:1/1/2/2;
    }
    .recentLocation{
        grid-area:2/1/3/2;
        font-size:30px;
    }
    .recentMagunitude{
        grid-area:2/2/3/3;
        align-self:end;
    }
    .recentMaxscale{
        grid-area:1/3/3/4;
        font-size:50px;
        justify-self: end;
    }
    .other{
        grid-area:3/4/4/5;
        overflow-y: scroll;
        border-left:5px solid #03DAC5;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 7px 29px 0px; 
    }
    .noTsunami{
        font-size:25px;
        margin:0 !important;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform : translate(-50%,-50%);
        transform : translate(-50%,-50%);
        text-align: center;
    }
    .map {
        margin:0 !important;
        width: calc(70vw - 70px);
        height:calc(62vh - 20px);
    }
</style>