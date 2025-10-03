package com.usradio.app.api;

import com.usradio.app.model.RadioStation;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface RadioBrowserService {
    
    @GET("json/stations/bycountry/USA")
    Call<List<RadioStation>> getUSAStations(
        @Query("limit") int limit,
        @Query("offset") int offset,
        @Query("order") String order,
        @Query("reverse") boolean reverse
    );
    
    @GET("json/stations/search")
    Call<List<RadioStation>> searchStations(
        @Query("name") String name,
        @Query("country") String country,
        @Query("limit") int limit
    );
}
