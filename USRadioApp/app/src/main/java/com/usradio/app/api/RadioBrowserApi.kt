package com.usradio.app.api

import com.usradio.app.model.RadioStation
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

interface RadioBrowserApi {
    
    @GET("json/stations/bycountrycodeexact/US")
    suspend fun getUSStations(
        @Query("limit") limit: Int = 1000,
        @Query("offset") offset: Int = 0,
        @Query("hidebroken") hideBroken: Boolean = true
    ): Response<List<RadioStation>>
    
    @GET("json/stations/search")
    suspend fun searchStations(
        @Query("name") name: String? = null,
        @Query("country") country: String = "United States",
        @Query("limit") limit: Int = 100,
        @Query("offset") offset: Int = 0,
        @Query("hidebroken") hideBroken: Boolean = true
    ): Response<List<RadioStation>>
    
    @GET("json/stations/topvote")
    suspend fun getTopStations(
        @Query("limit") limit: Int = 100,
        @Query("offset") offset: Int = 0,
        @Query("hidebroken") hideBroken: Boolean = true
    ): Response<List<RadioStation>>
}