package com.usradio.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.usradio.app.model.RadioStation
import com.usradio.app.repository.FavoritesRepository
import com.usradio.app.repository.RadioRepository
import kotlinx.coroutines.launch

class RadioViewModel(application: Application) : AndroidViewModel(application) {
    
    private val radioRepository = RadioRepository()
    private val favoritesRepository = FavoritesRepository(application)
    
    private val _stations = MutableLiveData<List<RadioStation>>()
    val stations: LiveData<List<RadioStation>> = _stations
    
    private val _favoriteStations = MutableLiveData<List<RadioStation>>()
    val favoriteStations: LiveData<List<RadioStation>> = _favoriteStations
    
    private val _filteredStations = MutableLiveData<List<RadioStation>?>()
    val filteredStations: LiveData<List<RadioStation>?> = _filteredStations
    
    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading
    
    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error
    
    private val _currentPlayingStation = MutableLiveData<RadioStation?>()
    val currentPlayingStation: LiveData<RadioStation?> = _currentPlayingStation
    
    private val _isPlaying = MutableLiveData<Boolean>()
    val isPlaying: LiveData<Boolean> = _isPlaying
    
    private var allStations: List<RadioStation> = emptyList()
    
    init {
        loadFavorites()
    }
    
    fun loadStations() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            radioRepository.getUSStations()
                .onSuccess { stationList ->
                    allStations = updateStationsWithFavorites(stationList)
                    _stations.value = allStations
                    _isLoading.value = false
                }
                .onFailure { exception ->
                    _error.value = exception.message ?: "Unknown error occurred"
                    _isLoading.value = false
                }
        }
    }
    
    fun searchStations(query: String) {
        if (query.isBlank()) {
            _stations.value = allStations
            return
        }
        
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            radioRepository.searchStations(query)
                .onSuccess { stationList ->
                    val searchResults = updateStationsWithFavorites(stationList)
                    _stations.value = searchResults
                    _isLoading.value = false
                }
                .onFailure { exception ->
                    _error.value = exception.message ?: "Search failed"
                    _isLoading.value = false
                }
        }
    }
    
    fun filterStations(query: String) {
        if (query.isBlank()) {
            _filteredStations.value = null
            return
        }
        
        val filtered = allStations.filter { station ->
            station.getDisplayName().contains(query, ignoreCase = true) ||
            station.getDisplayTags().contains(query, ignoreCase = true) ||
            station.getDisplayCountry().contains(query, ignoreCase = true)
        }
        _filteredStations.value = filtered
    }
    
    fun filterFavorites(query: String) {
        val favorites = favoritesRepository.getFavorites()
        if (query.isBlank()) {
            _filteredStations.value = null
            return
        }
        
        val filtered = favorites.filter { station ->
            station.getDisplayName().contains(query, ignoreCase = true) ||
            station.getDisplayTags().contains(query, ignoreCase = true) ||
            station.getDisplayCountry().contains(query, ignoreCase = true)
        }
        _filteredStations.value = filtered
    }
    
    fun toggleFavorite(station: RadioStation) {
        val isFavorite = favoritesRepository.toggleFavorite(station)
        station.isFavorite = isFavorite
        
        // Update all station lists
        updateStationInLists(station)
        loadFavorites()
    }
    
    fun playStation(station: RadioStation) {
        _currentPlayingStation.value = station
        _isPlaying.value = true
    }
    
    fun pausePlayback() {
        _isPlaying.value = false
    }
    
    fun stopPlayback() {
        _currentPlayingStation.value = null
        _isPlaying.value = false
    }
    
    private fun loadFavorites() {
        val favorites = favoritesRepository.getFavorites()
        _favoriteStations.value = favorites
    }
    
    private fun updateStationsWithFavorites(stations: List<RadioStation>): List<RadioStation> {
        return stations.map { station ->
            station.copy(isFavorite = favoritesRepository.isFavorite(station.stationUuid))
        }
    }
    
    private fun updateStationInLists(updatedStation: RadioStation) {
        // Update main stations list
        _stations.value = _stations.value?.map { station ->
            if (station.stationUuid == updatedStation.stationUuid) {
                station.copy(isFavorite = updatedStation.isFavorite)
            } else {
                station
            }
        }
        
        // Update filtered stations list
        _filteredStations.value = _filteredStations.value?.map { station ->
            if (station.stationUuid == updatedStation.stationUuid) {
                station.copy(isFavorite = updatedStation.isFavorite)
            } else {
                station
            }
        }
        
        // Update allStations cache
        allStations = allStations.map { station ->
            if (station.stationUuid == updatedStation.stationUuid) {
                station.copy(isFavorite = updatedStation.isFavorite)
            } else {
                station
            }
        }
    }
}