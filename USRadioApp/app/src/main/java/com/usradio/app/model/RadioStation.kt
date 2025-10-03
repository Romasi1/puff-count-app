package com.usradio.app.model

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

@Parcelize
data class RadioStation(
    @SerializedName("stationuuid")
    val stationUuid: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("url")
    val url: String,
    
    @SerializedName("url_resolved")
    val urlResolved: String?,
    
    @SerializedName("homepage")
    val homepage: String?,
    
    @SerializedName("favicon")
    val favicon: String?,
    
    @SerializedName("country")
    val country: String?,
    
    @SerializedName("countrycode")
    val countryCode: String?,
    
    @SerializedName("state")
    val state: String?,
    
    @SerializedName("language")
    val language: String?,
    
    @SerializedName("tags")
    val tags: String?,
    
    @SerializedName("codec")
    val codec: String?,
    
    @SerializedName("bitrate")
    val bitrate: Int?,
    
    @SerializedName("votes")
    val votes: Int?,
    
    @SerializedName("clickcount")
    val clickCount: Int?,
    
    @SerializedName("lastcheckok")
    val lastCheckOk: Int?,
    
    @SerializedName("lastchecktime")
    val lastCheckTime: String?,
    
    var isFavorite: Boolean = false
) : Parcelable {
    fun getStreamUrl(): String {
        return urlResolved?.takeIf { it.isNotEmpty() } ?: url
    }
    
    fun getDisplayName(): String {
        return name.takeIf { it.isNotEmpty() } ?: "Radio Station"
    }
    
    fun getDisplayCountry(): String {
        return country?.takeIf { it.isNotEmpty() } ?: "Unknown"
    }
    
    fun getDisplayTags(): String {
        return tags?.takeIf { it.isNotEmpty() } ?: ""
    }
    
    fun getFaviconUrl(): String? {
        return favicon?.takeIf { it.isNotEmpty() && it != "null" }
    }
}