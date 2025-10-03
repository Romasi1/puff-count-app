package com.usradio.app.repository

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.usradio.app.model.RadioStation

class FavoritesRepository(context: Context) {
    
    companion object {
        private const val PREFS_NAME = "radio_favorites"
        private const val KEY_FAVORITES = "favorites"
    }
    
    private val sharedPreferences: SharedPreferences = 
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    private val gson = Gson()
    
    fun getFavorites(): List<RadioStation> {
        val json = sharedPreferences.getString(KEY_FAVORITES, null) ?: return emptyList()
        val type = object : TypeToken<List<RadioStation>>() {}.type
        return try {
            gson.fromJson(json, type) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }
    
    fun addFavorite(station: RadioStation) {
        val favorites = getFavorites().toMutableList()
        val existingIndex = favorites.indexOfFirst { it.stationUuid == station.stationUuid }
        
        if (existingIndex == -1) {
            station.isFavorite = true
            favorites.add(station)
            saveFavorites(favorites)
        }
    }
    
    fun removeFavorite(stationUuid: String) {
        val favorites = getFavorites().toMutableList()
        val index = favorites.indexOfFirst { it.stationUuid == stationUuid }
        
        if (index != -1) {
            favorites.removeAt(index)
            saveFavorites(favorites)
        }
    }
    
    fun isFavorite(stationUuid: String): Boolean {
        return getFavorites().any { it.stationUuid == stationUuid }
    }
    
    fun toggleFavorite(station: RadioStation): Boolean {
        return if (isFavorite(station.stationUuid)) {
            removeFavorite(station.stationUuid)
            false
        } else {
            addFavorite(station)
            true
        }
    }
    
    private fun saveFavorites(favorites: List<RadioStation>) {
        val json = gson.toJson(favorites)
        sharedPreferences.edit()
            .putString(KEY_FAVORITES, json)
            .apply()
    }
}