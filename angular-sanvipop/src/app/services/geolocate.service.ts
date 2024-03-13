import { Injectable } from '@angular/core';
import { MyGeolocation } from '../interfaces/my-geolocation';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GeolocateService {
  async getGeolocation(latitude: FormControl, longitude: FormControl): Promise<void> {
    try {
        const geolocation = await MyGeolocation.getLocation();
        latitude.setValue(geolocation.latitude + '');
        longitude.setValue(geolocation.longitude + '');
    } catch (e) {
        latitude.setValue('0');
        longitude.setValue('0');
        /*Swal.fire({
            icon: "error",
            title: "Geolocation denied",
            text: "Default values will be used",
        });*/
        console.log("Geolocalizacion denegada");
    }

    latitude.markAsTouched();
    longitude.markAsTouched();
  }
}
