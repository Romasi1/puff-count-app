package com.usradio.app.repository

import com.usradio.app.api.ApiClient
import com.usradio.app.model.RadioStation
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class RadioRepository {
    
    private val api = ApiClient.radioBrowserApi
    
    suspend fun getUSStations(): Result<List<RadioStation>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getUSStations(limit = 1000)
            if (response.isSuccessful) {
                val stations = response.body() ?: emptyList()
                // Filter out stations with invalid URLs
                val validStations = stations.filter { station ->
                    station.getStreamUrl().isNotEmpty() && 
                    station.lastCheckOk == 1 &&
                    station.getDisplayName().isNotEmpty()
                }
                Result.success(validStations)
            } else {
                Result.failure(Exception("Error: ${response.code()} ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun searchStations(query: String): Result<List<RadioStation>> = withContext(Dispatchers.IO) {
        try {
            val response = api.searchStations(name = query)
            if (response.isSuccessful) {
                val stations = response.body() ?: emptyList()
                // Filter US stations and valid URLs
                val validStations = stations.filter { station ->
                    station.getStreamUrl().isNotEmpty() && 
                    station.lastCheckOk == 1 &&
                    station.getDisplayName().isNotEmpty() &&
                    (station.country?.contains("United States", ignoreCase = true) == true ||
                     station.countryCode?.equals("US", ignoreCase = true) == true)
                }
                Result.success(validStations)
            } else {
                Result.failure(Exception("Error: ${response.code()} ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getTopStations(): Result<List<RadioStation>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getTopStations(limit = 200)
            if (response.isSuccessful) {
                val stations = response.body() ?: emptyList()
                // Filter US stations and valid URLs
                val validStations = stations.filter { station ->
                    station.getStreamUrl().isNotEmpty() && 
                    station.lastCheckOk == 1 &&
                    station.getDisplayName().isNotEmpty() &&
                    (station.country?.contains("United States", ignoreCase = true) == true ||
                     station.countryCode?.equals("US", ignoreCase = true) == true)
                }
                Result.success(validStations)
            } else {
                Result.failure(Exception("Error: ${response.code()} ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}