/**
 * 基于leaflet地图框架封装常用功能方法
 */
;(function(global, factory){
    return factory(global);
})(typeof window !== "undefined" ? window : this, function( window, noGlobal){
    var __M__ = {
        M: null,      // 地图对象
        circleLayer: [],
        center: null,   // 地图中心点
        markerIcon: L.icon({
            iconUrl: '/static/img/map/marker-icon.png',
            iconSize: [25, 40],
            iconAnchor: [12.5, 40],
            popupAnchor: [0, -13]
        }),
        layerOptions:{
            color: 'red',
            opacity: .5,
            weight: 2,
            fillColor: 'red',
            fillOpacity: .5
        },
        init:function(dom){
            // 地图中心点
            var mapLatlng = [39.92,105.46];  // 北京
            // 初始化地图
            var mymap = L.map(dom,{
                zoomControl: false, //隐藏默认缩放按钮
                attributionControl: false,//隐藏copyright
                maxZoom:"20",//最大显示层级
                minZoom:"4",//最小显示层级
                rotate: true, // 地图是否可以旋转
                editable: true,
                closePopupOnClick: false
            }).setView(mapLatlng, 4);
            // 添加地图瓦片
            // L.tileLayer('http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}', {
            //     minZoom: 4,
            //     maxZoom: 20
            // }).addTo(mymap); 

            // 添加地图瓦片
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                minZoom: 4,
                maxZoom: 20
            }).addTo(mymap); 
            
            return mymap;
        },
        /**
         * 修改地图中心点位置
         * @param  
         */
        setMapCenter: function(map,latlngs){
            map.setView(latlngs)
        },
        /**
         * 添加点
         * @param options 
         */
        addPoint: function(map,options){
            var point = L.marker([options.lat,options.lng],{
                id: options.id,
                type:'point',
                icon: options.markerIcon,
                obj: options.obj
            })
            map&&map.addLayer(point);
            return point;
        },
        /**
         * 添加线
         * @param options 
         */
        addLine: function(map,options){
            var line = L.polyline(options.latlngs, {
                id: options.id,
                type:'line',
                color: options.color,
                opacity: options.opacity,
                weight: options.weight
            });
            map&&map.addLayer(line);
            return line;
        },
        /**
         * 添加圆
         * @param options 
         */
        addCircle: function(map,options){
            var circle = L.circle([options.lat, options.lng], {
                id: options.id,
                type:'circle',
                color: options.color, //描边色
                fillColor: options.fillColor,  //填充色
                fillOpacity: options.fillOpacity, //透明度
                weight: options.weight,    
                radius: options.radius //半径，单位米
            });
            map&&map.addLayer(circle);
            return circle;
        },
        /**
         * 添加多边形
         * @param options 
         */
        addPolygon: function(map,options){
            var polygon = polygon = L.polygon(options.latlngs, {
                id: options.id,
                type:'polygon',
                color: options.color,
                fillColor: options.fillColor,
                fillOpacity: options.fillOpacity, //透明度
                weight: options.weight
            });
            map&&map.addLayer(polygon);
            return polygon;
        },
        /**
         * 图形可编辑
         * @param layer 
         */
        layerEdit: function(layer){
            layer.enableEdit();
            layer.on('dblclick', layer.toggleEdit);
        },
        /**
         * 查看图形
         * @param layer 
         */
        fitBounds: function(map,layer){
            map.fitBounds(layer.getBounds())
        },
        /**
         * 获取图形数据
         * @param layer 
         */
        getLayerData: function(layer){
            // 根据图层类型 返回对应数据
            var _t = layer.options.type;
            switch (_t){
                case 'point':
                    return layer.getLatLng();
                case 'line':
                    return layer.getLatLngs();
                case 'circle':
                    return {
                        center: layer.getLatLng(),
                        radius: layer.getRadius()
                    }
                case 'polygon':
                    return layer.getLatLngs();
                default:
                    return false;
            }
        },
        /**
         * 地图图层显示隐藏
         * @param layer 
         */
        layerShow: function(map,layer){
            map.addLayer(layer);
        },
        layerHide: function(map,layer){
            map.removeLayer(layer);
        },
        /**
         * 地图图层提示框
         * @param layer  htmlstr
         */
        bindToolTip: function(layer,htmlstr,className){
            layer.bindTooltip(htmlstr, {
                permanent : true,           // 是否永久显示提示
                opacity: .9,                // 提示透明度
                offset : [ 18, 0 ],          // 偏移位置
                direction : "right",        // 放置位置
                sticky:false,               //提示是否跟随鼠标
                className : className,      // CSS控制
            });
        },
        /**
         * marker弹框
         * @param layer  htmlstr
         */ 
        bindPopup: function(layer,htmlstr) {
            layer.bindPopup(htmlstr,{
                minWidth: 200,
                maxWidth: 270,
                offset:[0,5],
                opacity: 0.2,
                closeButton: false,
                autoClose: false,
                closeOnEscapeKey: false,
                autoPan: false,
                className: 'uav_panel'
            }).openPopup();
        },
        /**
         * 动态绘制点
         * @param options
         */
        DrawPoint: function(map,cb){
            var _this = this;
            var layer = null;
            map.on('mousedown',onmouseDown);
            // 鼠标按下事件
            function onmouseDown(e) {
                var o = {
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                    icon: _maparkerIcon
                }
                layer = _this.addPoint(o);
                _this.layerEdit(layer)
                cb(layer)
            }
            map.on('mouseup',function(){
                _map.off('mousedown',onmouseDown);
            })
        },
        /**
         * 动态绘制线
         * @param options
         */
        DrawLine: function(map,cb){
            var _this = this;
            var points = []
            var lines = new L.polyline(points)
            var tempLines = new L.polyline([])
            map.on('click', onClick);    //点击地图
            map.on('dblclick', onDoubleClick);
 
            function onClick(e) {
                points.push([e.latlng.lat, e.latlng.lng])
                lines.addLatLng(e.latlng)
                map.addLayer(lines)
                // map.addLayer(L.circle(e.latlng, { color: '#ff0000', fillColor: 'ff0000', fillOpacity: 1 }))
                map.on('mousemove', onMove)//双击地图
            }
            function onMove(e) {
                if (points.length > 0) {
                    ls = [points[points.length - 1], [e.latlng.lat, e.latlng.lng]]
                    tempLines.setLatLngs(ls)
                    map.addLayer(tempLines)
                }
            }
 
            function onDoubleClick(e) {
                var line = L.polyline(points);
                map.addLayer(line);
                map.removeLayer(tempLines);
                map.removeLayer(lines);
                points = []
                map.off('mousemove',onMove);
                map.off('click', onClick);    //点击地图
                map.off('dblclick', onDoubleClick);
                cb(line);
            }
        },
        /**
         * 动态绘制圆
         * @param options
         */
        DrawCircle: function(map,cb){
            var r = 0
            var i = null
            var tempCircle = new L.circle()
            
            map.on('mousedown', onmouseDown);
            map.on('mouseup', onmouseUp);
            map.on('mousemove', onMove)
            function onmouseDown(e) {
                i = e.latlng
                //确定圆心
                map.dragging.disable();//将mousemove事件移动地图禁用
            }
            function onMove(e) {
                if (i) {
                    r = L.latLng(e.latlng).distanceTo(i)
                    tempCircle.setLatLng(i)
                    tempCircle.setRadius(r)
                    map.addLayer(tempCircle)

                }
            }
            //L.control.scale().addTo(map);
            function onmouseUp(e) {
                r = L.latLng(e.latlng).distanceTo(i)//计算半径
                map.removeLayer(tempCircle)
                var circle = L.circle(i, { radius: r});
                var _latlng = circle.getLatLng();
                var obj = {
                    lat:_latlng.lat,
                    lng:_latlng.lng,
                    radius:r
                }
                map.addLayer(circle)
                i = null
                r = 0
                map.dragging.enable();
                map.off('mousedown', onmouseDown);
                map.off('mouseup', onmouseUp);
                map.off('mousemove', onMove);
                cb(circle,obj)
            }
        },
        /**
         * 动态绘制多边形
         * @param options
         */
        DrawPolygon: function(map,cb){
            var points = []
            var lines = new L.polyline([])
            var tempLines = new L.polygon([])
            map.on('click', onClick);    //点击地图
            map.on('dblclick', onDoubleClick);//双击完成
            map.on('mousemove', onMove)
            function onClick(e) {

                points.push([e.latlng.lat, e.latlng.lng])
                lines.addLatLng(e.latlng)
                map.addLayer(lines)

            }
            function onMove(e) {
                if (points.length > 0) {
                    ls = [points[points.length - 1], [e.latlng.lat, e.latlng.lng]]
                    tempLines.setLatLngs(ls)
                    map.addLayer(tempLines)
                }
            }

            function onDoubleClick(e) {
                var p = L.polygon([points]);
                map.addLayer(p)
                map.removeLayer(lines)
                map.removeLayer(tempLines)
                points = []
                lines = new L.polyline([]);
                map.off('click', onClick);    //点击地图
                map.off('dblclick', onDoubleClick);//双击完成
                map.off('mousemove', onMove)
                cb(p)
            }
        }

    }
    if(!noGlobal){
        window.__MAP__ = __M__;
    }
});