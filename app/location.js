/**
 * Get current address and locality
 */
var getCurrentLocationData = function () {
    var def = $.Deferred();
    return getCurrentPosition().then(function (currentLocation) {
        return reverseGeocoding(currentLocation).then(function (addressData) {
            if (addressData && addressData.results && addressData.results.length > 0) {
                var locality = getLocalityData(addressData.results[0].address_components);
                def.resolve(addressData.results[0].formatted_address, locality);
            } else {
                def.resolve('error');
            }
            return def.promise();
        }, function () {
            def.resolve('error');
            return def.promise();
        });
    });
};

/**
 * Get current address information by Google Maps Reverse Geocoding API
 * @param {object} currentLocation current location data
 * @param {number} currentLocation.latitude latitude of current location
 * @param {number} currentLocation.longitude longitude of current location
 */
var reverseGeocoding = function (currentLocation) {
    var def = $.Deferred();
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
            currentLocation.latitude + ',' +
            currentLocation.longitude;
    var setting = {
        url: url,
        type: 'GET',
        dataType: 'json',
        xhr: function () { return da.getXhr(); },
        success: function (data, textStatus, jqXHR) {
            console.log('ajax success');
            def.resolve(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('ajax error');
            console.log('textStatus : ' + textStatus);
            console.log('errorThrown : ' + errorThrown);
            if (jqXHR !== null) {
                console.log('responseJSON : ' + jqXHR.responseJSON);
                console.log('status : ' + jqXHR.status);
            }
            if (textStatus === 'abort') {
                console.log('abort');
            }
            def.reject();
        }
    };
    $.ajax(setting);
    return def.promise();
};

/**
 * Get locality data from address components acquired by Google Maps Reverse Geocoding API
 * @param {object} addressComponents address components
 */
var getLocalityData = function (addressComponents) {
    var locality;
    addressComponents.some(function (component) {
        var isLocality = component.types.some(function (type) {
            if (type === 'locality') {
                return true;
            }
        });
        if (isLocality) {
            locality = component.long_name;
        }
    });
    return locality;
};