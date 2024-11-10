import { useEffect } from "react";
import useMapContext from "./useMapContext";

const useCustomCrs = () => {
    const { leafletLib, map } = useMapContext();
    
    useEffect(() => {
        const L = leafletLib;
        if (map && L && map.options.crs?.code == 'EPSG:3857') {
            console.log('Setting map CRS');
            const center_x = 117.3;
            const center_y = 172.8;
            const scale_x = 0.02072;
            const scale_y = 0.0205;
    
            const CUSTOM_CRS = L.extend({}, L.CRS.Simple, {
                projection: L.Projection.LonLat,
                scale: function (zoom: number) {
                    return Math.pow(2, zoom);
                },
                zoom: function (sc: number) {
                    return Math.log(sc) / 0.6931471805599453;
                },
                distance: function (pos1: L.LatLng, pos2: L.LatLng) {
                    var x_difference = pos2.lng - pos1.lng;
                    var y_difference = pos2.lat - pos1.lat;
                    return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
                },
                transformation: new L.Transformation(scale_x, center_x, -scale_y, center_y),
                infinite: true
            });
    
            map.options.crs = CUSTOM_CRS
            map.getBounds();
            map.options.bounceAtZoomLimits = true;
            map.options.maxBoundsViscosity = 1.0;
            var southWest = map.unproject([0, 31 * 256], map.getMaxZoom());
            var northEast = map.unproject([31 * 256, 0], map.getMaxZoom());
            map.setMaxBounds(new L.LatLngBounds(southWest, northEast));
        }
    }, [leafletLib, map]); // Run only when map or leafletLib changes
};

export default useCustomCrs;
